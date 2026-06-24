import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User.model";
import Project from "../../../../models/Project.model";
import Hub from "../../../../models/Hub.model";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await req.json();
    await connectDB();

    const project = await Project.findById(projectId).populate("owner");
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.owner._id.toString() !== session.user.id) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }

    // Get owner's GitHub access token
    const owner = await User.findById(session.user.id);
    if (!owner?.githubAccessToken) {
      return NextResponse.json(
        {
          message:
            "GitHub access token not found. Please sign out and sign in again to grant repo permissions.",
        },
        { status: 400 }
      );
    }

    // Create GitHub repo
    const repoName = project.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);

    const createRepoRes = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${owner.githubAccessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        description: project.description,
        private: false,
        auto_init: true,
      }),
    });

    if (!createRepoRes.ok) {
      const err = await createRepoRes.json();
      return NextResponse.json(
        { message: err.message || "Failed to create GitHub repo" },
        { status: 400 }
      );
    }

    const repo = await createRepoRes.json();
    const repoUrl = repo.html_url;

    // Get hub and invite all members
    const hub = await Hub.findOne({ project: projectId }).populate(
      "members",
      "githubUsername"
    );

    if (hub) {
      // Invite each member as collaborator (skip owner)
      for (const member of hub.members as any[]) {
        if (
          member.githubUsername &&
          member.githubUsername !== owner.githubUsername
        ) {
          await fetch(
            `https://api.github.com/repos/${owner.githubUsername}/${repoName}/collaborators/${member.githubUsername}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${owner.githubAccessToken}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ permission: "push" }),
            }
          );
        }
      }

      // Save repo URL to Resource Vault automatically
      const { default: Resource } = await import(
        "../../../../models/Resource.model"
      );
      await Resource.create({
        hub: hub._id,
        project: projectId,
        title: `${project.title} — GitHub Repo`,
        url: repoUrl,
        type: "GITHUB",
        createdBy: session.user.id,
      });
    }

    return NextResponse.json({
      message: "GitHub repo created and team invited successfully!",
      repoUrl,
    });
  } catch (error) {
    console.error("GITHUB SETUP ERROR:", error);
    return NextResponse.json(
      { message: "Failed to setup GitHub repo" },
      { status: 500 }
    );
  }
}