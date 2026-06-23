"use client";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
};

export default function GitHubReposList({ repos }: { repos: Repo[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {repos.map((repo) => {
        return (
          <div
            key={repo.id}
            onClick={() => window.open(repo.html_url, "_blank")}
            className="border rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
          >
            <h3 className="font-bold">{repo.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {repo.description || "No description"}
            </p>
            <p className="text-sm mt-3">
              {repo.language || "Unknown"} · ⭐ {repo.stargazers_count}
            </p>
          </div>
        );
      })}
    </div>
  );
}