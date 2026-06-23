"use client";

import { GitHubCalendar } from "react-github-calendar";

export default function ContributionGraph({
  username,
}: {
  username: string;
}) {
  return (
    <div className="overflow-x-auto">
      <GitHubCalendar username={username} />
    </div>
  );
}