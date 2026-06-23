import GitHubReposList from "./GitHubReposList";

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
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    return <p className="text-gray-500">Could not load repositories.</p>;
  }

  const repos: Repo[] = await res.json();

  if (repos.length === 0) {
    return <p className="text-gray-500">No public repositories found.</p>;
  }

  return <GitHubReposList repos={repos} />;
}