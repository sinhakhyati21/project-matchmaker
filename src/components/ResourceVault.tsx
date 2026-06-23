"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Resource = {
  _id: string;
  title: string;
  url: string;
  type: string;
};

export default function ResourceVault({
  hubId,
  projectId,
  resources,
}: {
  hubId: string;
  projectId: string;
  resources: Resource[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("OTHER");
  const [loading, setLoading] = useState(false);

  async function createResource(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !url) {
      alert("Title and URL are required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hubId,
        projectId,
        title,
        url,
        type,
      }),
    });

    if (res.ok) {
      setTitle("");
      setUrl("");
      setType("OTHER");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to add resource");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={createResource}
        className="border rounded-xl p-4 space-y-3"
      >
        <h3 className="font-bold">Add Resource</h3>

        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Resource title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="GITHUB">GitHub</option>
          <option value="DESIGN">Design</option>
          <option value="DOCS">Docs</option>
          <option value="PRESENTATION">
            Presentation
          </option>
          <option value="OTHER">Other</option>
        </select>

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Resource"}
        </button>
      </form>

      {resources.length === 0 ? (
        <p className="text-gray-500">
          No resources added yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <a
              key={resource._id}
              href={resource.url}
              target="_blank"
              className="border rounded-xl p-4 hover:bg-gray-50"
            >
              <p className="text-sm text-gray-500">
                {resource.type}
              </p>

              <h3 className="font-bold">
                {resource.title}
              </h3>

              <p className="text-sm text-blue-600 break-all mt-1">
                {resource.url}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}