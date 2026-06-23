import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { connectDB } from "../../lib/db";
import User from "../../models/User.model";
import StatusUpdate from "../../components/StatusUpdate";
import GitHubRepos from "../../components/GitHubRepos";
import ContributionGraph from "../../components/ContributionGraph";
import SkillsEditor from "../../components/SkillsEditor";
import "../../models/Review.model";
import { getTrustScore } from "../../lib/trustScore";
import ProfileGithubLink from "../../components/ProfileGithubLink";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  await connectDB();

  const user = await User.findById(session.user.id);

  if (!user) {
    redirect("/signin");
  }

  const trustScore = await getTrustScore(session.user.id);
  const safeUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="p-10 space-y-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex gap-6 items-center">
        {safeUser.image && (
          <img
            src={safeUser.image}
            alt={safeUser.name}
            className="w-24 h-24 rounded-full border"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{safeUser.name}</h1>
          <p className="text-gray-500">@{safeUser.githubUsername}</p>
          <p className="mt-2">
            {safeUser.githubBio || "No GitHub bio available."}
          </p>
          {safeUser.githubUrl && (
            <ProfileGithubLink url={safeUser.githubUrl} />
          )}
        </div>
      </div>

      {/* Status */}
      <StatusUpdate currentStatus={safeUser.status} />

      {/* Skills */}
      <SkillsEditor currentSkills={safeUser.skills || []} />

      {/* Trust Score */}
      <section className="border rounded-xl p-5">
        <h2 className="text-2xl font-bold">Trust Score</h2>
        {trustScore.count === 0 ? (
          <p className="text-gray-500 mt-2">No reviews yet.</p>
        ) : (
          <>
            <p className="text-4xl font-bold mt-2">
              {trustScore.average}/5
            </p>
            <p className="text-gray-500 mt-1">
              Based on {trustScore.count} review(s)
            </p>
          </>
        )}
      </section>

      {/* Contribution Graph */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          GitHub Contribution Graph
        </h2>
        <ContributionGraph username={safeUser.githubUsername} />
      </section>

      {/* Repos */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Public Repositories</h2>
        <GitHubRepos username={safeUser.githubUsername} />
      </section>

    </div>
  );
}