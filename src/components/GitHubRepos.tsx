type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
};

export default async function GitHubRepos({
  username,
}: {
  username: string;
}) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    return <p className="text-gray-500">Could not load repositories.</p>;
  }

  const repos: Repo[] = await res.json();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {repos.map((repo) => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          className="border rounded-xl p-4 hover:bg-gray-50"
        >
          <h3 className="font-bold">{repo.name}</h3>

          <p className="text-sm text-gray-500 mt-1">
            {repo.description || "No description"}
          </p>

          <p className="text-sm mt-3">
            {repo.language || "Unknown"} · ⭐ {repo.stargazers_count}
          </p>
        </a>
      ))}
    </div>
  );
}