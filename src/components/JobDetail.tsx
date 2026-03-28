"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

interface Posting {
  id: string;
  title: string;
  company: string;
  url: string;
  description: string;
  responsibilities: string;
  skills: string;
}

interface Job {
  id: string;
  title: string;
  postings: Posting[];
}

function PostingCard({
  posting,
  onSaved,
  onDelete,
}: {
  posting: Posting;
  onSaved: (updated: Posting) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(posting);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const update = (data: Partial<Posting>) => {
    setDraft((prev) => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/postings/${posting.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        const updated = await res.json();
        onSaved(updated);
        setSaveStatus("Saved");
      } else {
        setSaveStatus("Error saving");
      }
    } catch {
      setSaveStatus("Error saving");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 2000);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {draft.title}
          </span>
          {draft.company && (
            <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
              at {draft.company}
            </span>
          )}
        </div>
        <span className="text-zinc-400 text-sm shrink-0 ml-2">
          {expanded ? "Collapse" : "Expand"}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Job Title
              </label>
              <input
                value={draft.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Company
              </label>
              <input
                value={draft.company}
                onChange={(e) => update({ company: e.target.value })}
                placeholder="Acme Inc."
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Job Listing URL
            </label>
            <input
              type="url"
              value={draft.url}
              onChange={(e) => update({ url: e.target.value })}
              placeholder="https://example.com/careers/senior-frontend"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Job Description
            </label>
            <textarea
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Paste the job description here..."
              rows={4}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Things You Get to Do
            </label>
            <textarea
              value={draft.responsibilities}
              onChange={(e) => update({ responsibilities: e.target.value })}
              placeholder="Paste the responsibilities / what you'll do section..."
              rows={4}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Skills Required
            </label>
            <textarea
              value={draft.skills}
              onChange={(e) => update({ skills: e.target.value })}
              placeholder="Paste the required skills / qualifications..."
              rows={4}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => onDelete(posting.id)}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Delete posting
            </button>
            <div className="flex items-center gap-3">
              {saveStatus && (
                <span
                  className={`text-sm ${saveStatus === "Saved" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {saveStatus}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobDetail({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadJob = useCallback(async () => {
    const res = await fetch(`/api/jobs/${jobId}`);
    if (res.ok) {
      const data = await res.json();
      setJob(data);
    }
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const handleAddPosting = async () => {
    if (!newTitle.trim()) return;
    const res = await fetch(`/api/jobs/${jobId}/postings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    if (res.ok) {
      setNewTitle("");
      setAdding(false);
      loadJob();
    }
  };

  const handlePostingSaved = (updated: Posting) => {
    setJob((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        postings: prev.postings.map((p) =>
          p.id === updated.id ? updated : p
        ),
      };
    });
  };

  const handleDeletePosting = async (id: string) => {
    if (!confirm("Delete this posting?")) return;
    setJob((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        postings: prev.postings.filter((p) => p.id !== id),
      };
    });
    await fetch(`/api/postings/${id}`, { method: "DELETE" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddPosting();
    if (e.key === "Escape") {
      setAdding(false);
      setNewTitle("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-zinc-500 dark:text-zinc-400">Job not found.</p>
        <Link
          href="/dashboard"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors mb-4 inline-block"
      >
        &larr; Back to dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {job.title}
        </h2>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Reference Postings
          </h3>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm leading-none"
            title="Add posting"
          >
            +
          </button>
        </div>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">
          Add job postings you&apos;ve found. We&apos;ll use these to tailor your CV.
        </p>
      </div>

      <div className="space-y-3">
        {adding && (
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newTitle.trim()) setAdding(false);
              }}
              placeholder="e.g. Frontend Engineer at Acme Inc."
              className="flex-1 rounded-md border border-blue-400 dark:border-blue-500 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddPosting}
              disabled={!newTitle.trim()}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>
        )}

        {job.postings.map((posting) => (
          <PostingCard
            key={posting.id}
            posting={posting}
            onSaved={handlePostingSaved}
            onDelete={handleDeletePosting}
          />
        ))}

        {job.postings.length === 0 && !adding && (
          <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-8">
            No postings yet. Click + to add a job offer you found.
          </p>
        )}
      </div>
    </div>
  );
}
