import { notFound } from "next/navigation";

import { connectDB } from "../../../lib/db";
import User from "../../../models/User.model";
import GitHubRepos from "../../../components/GitHubRepos";
import ContributionGraph from "../../../components/ContributionGraph";

export default async function PublicUserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  await connectDB();

  const user = await User.findOne({
    githubUsername: username,
  });

  if (!user) {
    notFound();
  }

  const safeUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="p-10 space-y-8">
      <div className="flex gap-6 items-center">
        {safeUser.image && (
          <img
            src={safeUser.image}
            alt={safeUser.name}
            className="w-24 h-24 rounded-full"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold">{safeUser.name}</h1>

          <p className="text-gray-500">
            @{safeUser.githubUsername}
          </p>

          <p className="mt-2">
            {safeUser.githubBio || "No GitHub bio available."}
          </p>

          <p className="mt-2 font-medium">
            Status: {safeUser.status.replaceAll("_", " ")}
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          GitHub Contribution Graph
        </h2>

        <ContributionGraph username={safeUser.githubUsername} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Public Repositories
        </h2>

        <GitHubRepos username={safeUser.githubUsername} />
      </section>
    </div>
  );
}