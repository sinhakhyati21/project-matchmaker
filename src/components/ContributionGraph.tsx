"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

export default function ContributionGraph({
  username,
}: {
  username: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="overflow-x-auto">
      <GitHubCalendar username={username} />
    </div>
  );
}