"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Markdown from "react-markdown";

interface WorkEntry {
  id: string;
  company: string;
  url: string;
  position: string;
  description: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  current: boolean;
}

interface JobSummary {
  id: string;
  title: string;
}

interface WorkJobDesc {
  id: string;
  description: string;
  jobId: string;
  job: { id: string; title: string };
}

const MONTHS = [
  { value: 0, label: "Month" },
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currentYear = new Date().getFullYear();
const YEARS = [
  { value: 0, label: "Year" },
  ...Array.from({ length: 50 }, (_, i) => ({
    value: currentYear - i,
    label: String(currentYear - i),
  })),
];

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [preview, setPreview] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <div className="flex gap-1 rounded-md border border-zinc-200 dark:border-zinc-700 p-0.5">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${!preview ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${preview ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
          >
            Preview
          </button>
        </div>
      </div>
      {preview ? (
        <div className="w-full min-h-[10rem] rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 prose prose-sm dark:prose-invert max-w-none">
          {value ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-zinc-400 italic">Nothing to preview</p>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
        />
      )}
    </div>
  );
}

function JobDescriptionCard({
  desc,
  onSaved,
  onDelete,
}: {
  desc: WorkJobDesc;
  onSaved: (updated: WorkJobDesc) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState(desc.description);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/work-descriptions/${desc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: draft }),
      });
      if (res.ok) {
        onSaved({ ...desc, description: draft });
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
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 space-y-3">
      <MarkdownEditor
        label={desc.job.title}
        value={draft}
        onChange={setDraft}
        placeholder={`What did you do here that's relevant to "${desc.job.title}"? (Markdown supported)`}
      />
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => onDelete(desc.id)}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          Remove
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
            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkDetail({ workId }: { workId: string }) {
  const [work, setWork] = useState<WorkEntry | null>(null);
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<WorkJobDesc[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [workRes, jobsRes, descsRes] = await Promise.all([
      fetch(`/api/work/${workId}`),
      fetch("/api/jobs"),
      fetch(`/api/work/${workId}/descriptions`),
    ]);
    if (workRes.ok) setWork(await workRes.json());
    if (jobsRes.ok) setJobs(await jobsRes.json());
    if (descsRes.ok) setJobDescriptions(await descsRes.json());
    setLoading(false);
  }, [workId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const update = (data: Partial<WorkEntry>) => {
    setWork((prev) => (prev ? { ...prev, ...data } : prev));
  };

  const handleSave = async () => {
    if (!work) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`/api/work/${workId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(work),
      });
      if (res.ok) {
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

  const linkedJobIds = new Set(jobDescriptions.map((d) => d.jobId));
  const availableJobs = jobs.filter((j) => !linkedJobIds.has(j.id));

  const handleAddJobDesc = async () => {
    if (!selectedJobId) return;
    const res = await fetch(`/api/work/${workId}/descriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: selectedJobId }),
    });
    if (res.ok) {
      const created = await res.json();
      setJobDescriptions((prev) => [...prev, created]);
      setSelectedJobId("");
    }
  };

  const handleJobDescSaved = (updated: WorkJobDesc) => {
    setJobDescriptions((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  const handleDeleteJobDesc = async (id: string) => {
    setJobDescriptions((prev) => prev.filter((d) => d.id !== id));
    await fetch(`/api/work-descriptions/${id}`, { method: "DELETE" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  if (!work) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-zinc-500 dark:text-zinc-400">
          Work entry not found.
        </p>
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

      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        {work.company}
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Company
            </label>
            <input
              value={work.company}
              onChange={(e) => update({ company: e.target.value })}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Position
            </label>
            <input
              value={work.position}
              onChange={(e) => update({ position: e.target.value })}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Company URL
          </label>
          <input
            type="url"
            value={work.url}
            onChange={(e) => update({ url: e.target.value })}
            placeholder="https://example.com"
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date range */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
            Duration
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Start Month"
              value={work.startMonth}
              options={MONTHS}
              onChange={(v) => update({ startMonth: v })}
            />
            <SelectField
              label="Start Year"
              value={work.startYear}
              options={YEARS}
              onChange={(v) => update({ startYear: v })}
            />
          </div>

          <div className="mt-3">
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={work.current}
                onChange={(e) =>
                  update({
                    current: e.target.checked,
                    ...(e.target.checked ? { endMonth: 0, endYear: 0 } : {}),
                  })
                }
                className="rounded border-zinc-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500"
              />
              I currently work here
            </label>
          </div>

          {!work.current && (
            <div className="grid grid-cols-2 gap-4 mt-3">
              <SelectField
                label="End Month"
                value={work.endMonth}
                options={MONTHS}
                onChange={(v) => update({ endMonth: v })}
              />
              <SelectField
                label="End Year"
                value={work.endYear}
                options={YEARS}
                onChange={(v) => update({ endYear: v })}
              />
            </div>
          )}
        </div>

        <MarkdownEditor
          label="General Description"
          value={work.description}
          onChange={(v) => update({ description: v })}
          placeholder="Describe what you did in this role... (Markdown supported)"
        />

        {/* Job-specific descriptions */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
            Targeted Job Descriptions
          </h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">
            Describe what you did here that&apos;s specifically relevant to each targeted job.
          </p>

          <div className="space-y-4">
            {jobDescriptions.map((desc) => (
              <JobDescriptionCard
                key={desc.id}
                desc={desc}
                onSaved={handleJobDescSaved}
                onDelete={handleDeleteJobDesc}
              />
            ))}

            {availableJobs.length > 0 && (
              <div className="flex gap-2">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a targeted job...</option>
                  {availableJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddJobDesc}
                  disabled={!selectedJobId}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
            )}

            {jobs.length === 0 && (
              <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-6">
                No targeted jobs yet.{" "}
                <Link
                  href="/dashboard"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Add targeted jobs
                </Link>{" "}
                from the dashboard first.
              </p>
            )}

            {jobs.length > 0 && jobDescriptions.length === 0 && availableJobs.length > 0 && (
              <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-4">
                Select a targeted job above to add a tailored description for this role.
              </p>
            )}
          </div>
        </div>

        {/* Save general info */}
        <div className="flex items-center justify-end pt-4 border-t border-zinc-200 dark:border-zinc-700">
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
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
