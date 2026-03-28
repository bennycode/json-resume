"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  createdAt: string;
  _count: { postings: number };
}

interface WorkEntry {
  id: string;
  company: string;
  position: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  current: boolean;
}

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDateRange(entry: WorkEntry): string {
  const start =
    entry.startMonth && entry.startYear
      ? `${MONTH_NAMES[entry.startMonth]} ${entry.startYear}`
      : "";
  if (entry.current) return start ? `${start} - Present` : "Present";
  const end =
    entry.endMonth && entry.endYear
      ? `${MONTH_NAMES[entry.endMonth]} ${entry.endYear}`
      : "";
  if (start && end) return `${start} - ${end}`;
  return start || end || "";
}

function InlineAddInput({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (value: string) => void;
}) {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
    setActive(false);
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg leading-none"
      >
        +
      </button>
    );
  }

  return (
    <div className="flex gap-2 flex-1 ml-2">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") { setActive(false); setValue(""); }
        }}
        onBlur={() => { if (!value.trim()) setActive(false); }}
        placeholder={placeholder}
        className="flex-1 rounded-md border border-blue-400 dark:border-blue-500 bg-white dark:bg-zinc-800 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        Add
      </button>
    </div>
  );
}

export default function Dashboard({ userName }: { userName: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [work, setWork] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [jobsRes, workRes] = await Promise.all([
      fetch("/api/jobs"),
      fetch("/api/work"),
    ]);
    setJobs(await jobsRes.json());
    setWork(await workRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddJob = async (title: string) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) loadData();
  };

  const handleDeleteJob = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setJobs((prev) => prev.filter((j) => j.id !== id));
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
  };

  const handleAddWork = async (company: string) => {
    const res = await fetch("/api/work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company }),
    });
    if (res.ok) loadData();
  };

  const handleDeleteWork = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWork((prev) => prev.filter((w) => w.id !== id));
    await fetch(`/api/work/${id}`, { method: "DELETE" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Welcome, {userName || "there"}
        </h2>
      </div>

      {/* Work Experience */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Work Experience
          </h3>
          <InlineAddInput
            placeholder="e.g. Acme Inc."
            onAdd={handleAddWork}
          />
        </div>

        <div className="space-y-2">
          {work.map((entry) => (
            <Link
              key={entry.id}
              href={`/work/${entry.id}`}
              className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
            >
              <div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {entry.company}
                </span>
                {entry.position && (
                  <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {entry.position}
                  </span>
                )}
                {formatDateRange(entry) && (
                  <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
                    {formatDateRange(entry)}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => handleDeleteWork(e, entry.id)}
                className="opacity-0 group-hover:opacity-100 text-sm text-red-500 hover:text-red-600 transition-all"
              >
                Delete
              </button>
            </Link>
          ))}

          {work.length === 0 && (
            <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-6">
              No work experience yet. Click + to add a company.
            </p>
          )}
        </div>
      </section>

      {/* Targeted Jobs */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Targeted Jobs
          </h3>
          <InlineAddInput
            placeholder="e.g. Senior Frontend Engineer"
            onAdd={handleAddJob}
          />
        </div>

        <div className="space-y-2">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
            >
              <div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {job.title}
                </span>
                <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
                  {job._count.postings} {job._count.postings === 1 ? "posting" : "postings"}
                </span>
              </div>
              <button
                onClick={(e) => handleDeleteJob(e, job.id)}
                className="opacity-0 group-hover:opacity-100 text-sm text-red-500 hover:text-red-600 transition-all"
              >
                Delete
              </button>
            </Link>
          ))}

          {jobs.length === 0 && (
            <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-6">
              No jobs yet. Click + to add the role you&apos;re targeting.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
