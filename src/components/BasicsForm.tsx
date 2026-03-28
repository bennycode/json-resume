"use client";

import { useState } from "react";
import {
  ResumeBasics,
  ResumeProfile,
  createEmptyBasics,
  createEmptyProfile,
} from "@/types/resume";

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function ProfileEntry({
  profile,
  index,
  onChange,
  onRemove,
}: {
  profile: ResumeProfile;
  index: number;
  onChange: (index: number, profile: ResumeProfile) => void;
  onRemove: (index: number) => void;
}) {
  const update = (field: keyof ResumeProfile, value: string) => {
    onChange(index, { ...profile, [field]: value });
  };

  return (
    <div className="flex gap-3 items-start">
      <div className="grid grid-cols-3 gap-3 flex-1">
        <InputField
          label="Network"
          value={profile.network}
          onChange={(v) => update("network", v)}
          placeholder="LinkedIn"
        />
        <InputField
          label="Username"
          value={profile.username}
          onChange={(v) => update("username", v)}
          placeholder="johndoe"
        />
        <InputField
          label="URL"
          value={profile.url}
          onChange={(v) => update("url", v)}
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-6 shrink-0 rounded-md border border-red-300 dark:border-red-700 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        Remove
      </button>
    </div>
  );
}

function stripEmpty(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    const filtered = obj
      .map(stripEmpty)
      .filter(
        (item) =>
          item !== undefined &&
          item !== "" &&
          !(typeof item === "object" && item !== null && Object.keys(item).length === 0)
      );
    return filtered.length > 0 ? filtered : undefined;
  }

  if (typeof obj === "object" && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const stripped = stripEmpty(value);
      if (stripped !== undefined && stripped !== "") {
        result[key] = stripped;
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }

  return obj === "" ? undefined : obj;
}

export default function BasicsForm() {
  const [basics, setBasics] = useState<ResumeBasics>(createEmptyBasics);

  const update = (field: keyof ResumeBasics, value: string) => {
    setBasics((prev) => ({ ...prev, [field]: value }));
  };

  const updateLocation = (field: keyof ResumeBasics["location"], value: string) => {
    setBasics((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const updateProfile = (index: number, profile: ResumeProfile) => {
    setBasics((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p, i) => (i === index ? profile : p)),
    }));
  };

  const addProfile = () => {
    setBasics((prev) => ({
      ...prev,
      profiles: [...prev.profiles, createEmptyProfile()],
    }));
  };

  const removeProfile = (index: number) => {
    setBasics((prev) => ({
      ...prev,
      profiles: prev.profiles.filter((_, i) => i !== index),
    }));
  };

  const jsonOutput = JSON.stringify(
    { basics: stripEmpty(basics) ?? {} },
    null,
    2
  );

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-8">
        {/* Personal Info */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Personal Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              value={basics.name}
              onChange={(v) => update("name", v)}
              placeholder="John Doe"
            />
            <InputField
              label="Label"
              value={basics.label}
              onChange={(v) => update("label", v)}
              placeholder="Web Developer"
            />
            <InputField
              label="Email"
              value={basics.email}
              onChange={(v) => update("email", v)}
              type="email"
              placeholder="john@example.com"
            />
            <InputField
              label="Phone"
              value={basics.phone}
              onChange={(v) => update("phone", v)}
              type="tel"
              placeholder="+1 (555) 123-4567"
            />
            <InputField
              label="Website"
              value={basics.url}
              onChange={(v) => update("url", v)}
              type="url"
              placeholder="https://johndoe.com"
            />
            <InputField
              label="Image URL"
              value={basics.image}
              onChange={(v) => update("image", v)}
              type="url"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Summary
            </label>
            <textarea
              value={basics.summary}
              onChange={(e) => update("summary", e.target.value)}
              placeholder="A short bio about yourself..."
              rows={3}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
          </div>
        </section>

        {/* Location */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Location
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <InputField
                label="Address"
                value={basics.location.address}
                onChange={(v) => updateLocation("address", v)}
                placeholder="123 Main St"
              />
            </div>
            <InputField
              label="City"
              value={basics.location.city}
              onChange={(v) => updateLocation("city", v)}
              placeholder="San Francisco"
            />
            <InputField
              label="Region"
              value={basics.location.region}
              onChange={(v) => updateLocation("region", v)}
              placeholder="California"
            />
            <InputField
              label="Postal Code"
              value={basics.location.postalCode}
              onChange={(v) => updateLocation("postalCode", v)}
              placeholder="94101"
            />
            <InputField
              label="Country Code"
              value={basics.location.countryCode}
              onChange={(v) => updateLocation("countryCode", v)}
              placeholder="US"
            />
          </div>
        </section>

        {/* Profiles */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Profiles
            </h2>
            <button
              type="button"
              onClick={addProfile}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Add Profile
            </button>
          </div>
          {basics.profiles.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No profiles added yet. Click &quot;Add Profile&quot; to add your social
              media accounts.
            </p>
          )}
          <div className="space-y-4">
            {basics.profiles.map((profile, index) => (
              <ProfileEntry
                key={index}
                profile={profile}
                index={index}
                onChange={updateProfile}
                onRemove={removeProfile}
              />
            ))}
          </div>
        </section>
      </div>

      {/* JSON Preview */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            JSON Preview
          </h2>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            Download JSON
          </button>
        </div>
        <pre className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-4 text-sm text-zinc-800 dark:text-zinc-200 overflow-auto max-h-[80vh] font-mono">
          {jsonOutput}
        </pre>
      </div>
    </div>
  );
}
