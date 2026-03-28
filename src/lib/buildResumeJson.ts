import { prisma } from "./prisma";

function formatDate(month: number, year: number): string {
  if (!year) return "";
  if (!month) return String(year);
  return `${year}-${String(month).padStart(2, "0")}`;
}

export async function buildResumeJson(jobId?: string) {
  const resume = await prisma.resume.findFirst({
    include: {
      basics: { include: { location: true, profiles: true } },
      work: {
        include: { jobDescriptions: true },
        orderBy: [{ startYear: "desc" }, { startMonth: "desc" }],
      },
    },
  });

  if (!resume) throw new Error("No resume found");

  const basics = resume.basics;

  return {
    basics: basics
      ? {
          name: basics.name || undefined,
          label: basics.label || undefined,
          image: basics.image || undefined,
          email: basics.email || undefined,
          phone: basics.phone || undefined,
          url: basics.url || undefined,
          summary: basics.summary || undefined,
          location: basics.location
            ? {
                address: basics.location.address || undefined,
                postalCode: basics.location.postalCode || undefined,
                city: basics.location.city || undefined,
                countryCode: basics.location.countryCode || undefined,
                region: basics.location.region || undefined,
              }
            : undefined,
          profiles: basics.profiles
            .filter((p) => p.network || p.username || p.url)
            .map((p) => ({
              network: p.network || undefined,
              username: p.username || undefined,
              url: p.url || undefined,
            })),
        }
      : undefined,
    work: resume.work.map((w) => {
      const targetedDesc = jobId
        ? w.jobDescriptions.find((d) => d.jobId === jobId)
        : undefined;
      const summary = targetedDesc?.description || w.description;

      return {
        name: w.company,
        position: w.position || undefined,
        url: w.url || undefined,
        startDate: formatDate(w.startMonth, w.startYear) || undefined,
        endDate: w.current ? undefined : formatDate(w.endMonth, w.endYear) || undefined,
        summary: summary || undefined,
      };
    }),
  };
}
