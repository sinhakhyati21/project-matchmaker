"use client";

export default function ProfileGithubLink({ url }: { url: string }) {
  return (
    <button
      onClick={() => window.open(url, "_blank")}
      className="text-blue-600 text-sm hover:underline"
    >
      View GitHub Profile
    </button>
  );
}