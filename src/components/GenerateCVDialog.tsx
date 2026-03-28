"use client";

import { useEffect, useState } from "react";

interface Job {
  id: string;
  title: string;
}

interface Theme {
  id: string;
  name: string;
}

export default function GenerateCVDialog({ onClose }: { onClose: () => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/jobs").then((r) => r.json()),
      fetch("/api/cv/themes").then((r) => r.json()),
    ]).then(([jobsData, themesData]) => {
      setJobs(jobsData);
      setThemes(themesData);
      if (themesData.length > 0) setSelectedThemeId(themesData[0].id);
      setLoading(false);
    });
  }, []);

  const handleGenerate = async () => {
    if (!selectedThemeId) return;
    setGenerating(true);
    setError(null);
    try {
      const params = new URLSearchParams({ themeId: selectedThemeId });
      if (selectedJobId) params.set("jobId", selectedJobId);

      const res = await fetch(`/api/cv/generate?${params}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Generate CV
        </h3>

        {loading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4 text-center">
            Loading...
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Targeted Job
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">General (no targeting)</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                Select a job to use your tailored work descriptions, or leave empty for general.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Theme
              </label>
              <select
                value={selectedThemeId}
                onChange={(e) => setSelectedThemeId(e.target.value)}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={onClose}
            disabled={generating}
            className="rounded-md border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating || !selectedThemeId || loading}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {generating ? "Generating..." : "Generate PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
