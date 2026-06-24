import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User.model";
import Project from "../../../models/Project.model";
import "../../../models/Review.model";
import { getTrustScore } from "../../../lib/trustScore";

function normalizeSkill(skill: string) {
  return skill.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Score 1: GitHub activity — max 20 points
async function getGitHubActivityScore(
  githubUsername: string
): Promise<number> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${githubUsername}/events?per_page=30`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return 0;
    const events = await res.json();
    if (!Array.isArray(events)) return 0;
    return Math.min(events.length, 20);
  } catch {
    return 0;
  }
}

// Score 2: GitHub repos analysis — max 20 points
// Matches repo names, descriptions, and languages against required skills
async function getGitHubRepoScore(
  githubUsername: string,
  requiredSkills: { original: string; normalized: string }[]
): Promise<number> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=10`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return 0;
    const repos = await res.json();
    if (!Array.isArray(repos)) return 0;

    // Combine all repo text — name, description, language, topics
    const repoText = repos
      .map((repo: any) =>
        [
          repo.name || "",
          repo.description || "",
          repo.language || "",
          (repo.topics || []).join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
      )
      .join(" ");

    // Count how many required skills appear in repo text
    const matchedInRepos = requiredSkills.filter((skill) =>
      repoText.includes(skill.normalized)
    );

    if (requiredSkills.length === 0) return 0;

    // Max 20 points based on repo skill match ratio
    return Math.round((matchedInRepos.length / requiredSkills.length) * 20);
  } catch {
    return 0;
  }
}

// Score 3: Previous projects bonus — max 10 points
// Users who have been in completed projects get experience bonus
async function getPreviousProjectsScore(userId: string): Promise<number> {
  try {
    const completedProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
      status: "COMPLETED",
    }).countDocuments();

    // 3 points per completed project, max 10
    return Math.min(completedProjects * 3, 10);
  } catch {
    return 0;
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await req.json();
    await connectDB();

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "Only project owner can view recommendations" },
        { status: 403 }
      );
    }

    const users = await User.find({
      _id: {
        $ne: project.owner,
        $nin: project.members || [],
      },
    });

    const requiredSkills = project.requiredSkills.map((skill: string) => ({
      original: skill,
      normalized: normalizeSkill(skill),
    }));

    const recommendations = await Promise.all(
      users.map(async (user: any) => {
        const userSkills = (user.skills || []).map((skill: string) => ({
          original: skill,
          normalized: normalizeSkill(skill),
        }));

        // Skill match — 80 points max
        const matchedSkills = requiredSkills
          .filter((requiredSkill: any) =>
            userSkills.some(
              (userSkill: any) =>
                userSkill.normalized === requiredSkill.normalized
            )
          )
          .map((skill: any) => skill.original);

        const skillScore =
          requiredSkills.length === 0
            ? 0
            : Math.round(
                (matchedSkills.length / requiredSkills.length) * 80
              );

        // GitHub activity — 20 points max
        const activityScore = user.githubUsername
          ? await getGitHubActivityScore(user.githubUsername)
          : 0;

        // GitHub repos analysis — 20 points max
        const repoScore = user.githubUsername
          ? await getGitHubRepoScore(user.githubUsername, requiredSkills)
          : 0;

        // Previous projects experience — 10 points max
        const experienceScore = await getPreviousProjectsScore(
          user._id.toString()
        );

        // Status bonus — 5 points
        const statusBonus =
          user.status === "LOOKING_FOR_TEAM" ||
          user.status === "LOOKING_FOR_PROJECT"
            ? 5
            : 0;

        // Total score: skill(80) + activity(20) + repos(20) + experience(10) + status(5) = 135 max
        const totalScore =
          skillScore + activityScore + repoScore + experienceScore + statusBonus;

        const trustScore = await getTrustScore(user._id.toString());

        return {
          _id: user._id,
          name: user.name,
          image: user.image,
          githubUsername: user.githubUsername,
          status: user.status,
          skills: user.skills || [],
          matchedSkills,
          score: totalScore,
          skillScore,
          activityScore,
          repoScore,
          experienceScore,
          trustScore,
        };
      })
    );

    // Sort by score, then trust score
    recommendations.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.trustScore.average - a.trustScore.average;
    });

    // Only return users with score > 0
    const filtered = recommendations.filter((r) => r.score > 0);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("RECOMMENDATION ERROR:", error);
    return NextResponse.json(
      { message: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}