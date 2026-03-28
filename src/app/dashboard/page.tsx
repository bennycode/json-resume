import { prisma } from "@/lib/prisma";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  const resume = await prisma.resume.findFirst({
    include: { basics: true },
  });

  const userName = resume?.basics?.name ?? "";

  return <Dashboard userName={userName} />;
}
