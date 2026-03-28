"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import useLocalStorageState from "use-local-storage-state";
import Select, { SingleValue } from "react-select";
import {
  ResumeBasics,
  ResumeProfile,
  createEmptyBasics,
  createEmptyProfile,
} from "@/types/resume";
import { countries, countryCodeToFlag } from "@/data/countries";

type CountryOption = { value: string; label: string };

const countryOptions: CountryOption[] = countries.map((c) => ({
  value: c.code,
  label: `${countryCodeToFlag(c.code)}  ${c.name}`,
}));

const STEPS = [
  { id: "personal", title: "Personal Info", description: "Let's start with your name and contact details" },
  { id: "location", title: "Location", description: "Where are you based?" },
  { id: "profiles", title: "Online Profiles", description: "Add your social media and professional accounts" },
] as const;

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
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`h-2 flex-1 rounded-full transition-colors ${
              i <= current
                ? "bg-blue-600"
                : "bg-zinc-200 dark:bg-zinc-700"
            }`}
            style={{ width: `${100 / total}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export default function BasicsForm() {
  const [basics, setBasics] = useLocalStorageState<ResumeBasics>("resume-basics", {
    defaultValue: createEmptyBasics(),
  });
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const currentStep = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  useEffect(() => {
    if (localStorage.getItem("resume-basics")) {
      setLoading(false);
      return;
    }

    fetch("/api/resume")
      .then((res) => res.json())
      .then((data) => {
        if (data?.basics) {
          setBasics({
            name: data.basics.name ?? "",
            label: data.basics.label ?? "",
            image: data.basics.image ?? "",
            email: data.basics.email ?? "",
            phone: data.basics.phone ?? "",
            url: data.basics.url ?? "",
            summary: data.basics.summary ?? "",
            location: {
              address: data.basics.location?.address ?? "",
              postalCode: data.basics.location?.postalCode ?? "",
              city: data.basics.location?.city ?? "",
              countryCode: data.basics.location?.countryCode ?? "",
              region: data.basics.location?.region ?? "",
            },
            profiles: (data.basics.profiles ?? []).map(
              (p: { network?: string; username?: string; url?: string }) => ({
                network: p.network ?? "",
                username: p.username ?? "",
                url: p.url ?? "",
              })
            ),
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basics }),
      });
      if (res.ok) {
        router.push("/dashboard");
        return;
      } else {
        setSaveStatus("Error saving");
      }
    } catch {
      setSaveStatus("Error saving");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 2000);
    }
  }, [basics, router]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <StepIndicator current={step} total={STEPS.length} />

      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {currentStep.title}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        {currentStep.description}
      </p>

      {/* Step: Personal Info */}
      {currentStep.id === "personal" && (
        <div className="space-y-4">
          <InputField
            label="Full Name"
            value={basics.name}
            onChange={(v) => update("name", v)}
            placeholder="John Doe"
          />
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Website"
              value={basics.url}
              onChange={(v) => update("url", v)}
              type="url"
              placeholder="https://johndoe.com"
            />
            <InputField
              label="Photo URL"
              value={basics.image}
              onChange={(v) => update("image", v)}
              type="url"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>
      )}

      {/* Step: Location */}
      {currentStep.id === "location" && (
        <div className="space-y-4">
          <InputField
            label="Address"
            value={basics.location.address}
            onChange={(v) => updateLocation("address", v)}
            placeholder="123 Main St"
          />
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Postal Code"
              value={basics.location.postalCode}
              onChange={(v) => updateLocation("postalCode", v)}
              placeholder="94101"
            />
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Country
              </label>
              <Select<CountryOption>
                options={countryOptions}
                value={countryOptions.find((o) => o.value === basics.location.countryCode) ?? null}
                onChange={(option: SingleValue<CountryOption>) =>
                  updateLocation("countryCode", option?.value ?? "")
                }
                placeholder="Select a country..."
                isClearable
                classNames={{
                  control: () =>
                    "!rounded-md !border-zinc-300 dark:!border-zinc-600 !bg-white dark:!bg-zinc-800 !text-sm !min-h-[38px] !shadow-none focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:!border-blue-500",
                  menu: () => "!bg-white dark:!bg-zinc-800 !border !border-zinc-200 dark:!border-zinc-600 !rounded-md !shadow-lg",
                  option: ({ isFocused, isSelected }) =>
                    `!text-sm !cursor-pointer ${isSelected ? "!bg-blue-600 !text-white" : isFocused ? "!bg-zinc-100 dark:!bg-zinc-700" : "!bg-transparent"} !text-zinc-900 dark:!text-zinc-100 ${isSelected ? "!text-white" : ""}`,
                  singleValue: () => "!text-zinc-900 dark:!text-zinc-100",
                  input: () => "!text-zinc-900 dark:!text-zinc-100",
                  placeholder: () => "!text-zinc-400",
                }}
                unstyled={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step: Profiles */}
      {currentStep.id === "profiles" && (
        <div className="space-y-4">
          {basics.profiles.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4 text-center">
              No profiles added yet.
            </p>
          )}
          {basics.profiles.map((profile, index) => (
            <ProfileEntry
              key={index}
              profile={profile}
              index={index}
              onChange={updateProfile}
              onRemove={removeProfile}
            />
          ))}
          <button
            type="button"
            onClick={addProfile}
            className="w-full rounded-md border-2 border-dashed border-zinc-300 dark:border-zinc-600 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            + Add Profile
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={isFirst}
          className="rounded-md border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-0 transition-all"
        >
          Back
        </button>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <span
              className={`text-sm ${saveStatus === "Saved" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {saveStatus}
            </span>
          )}
          {isLast ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
