import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const resume = await prisma.resume.findFirst();
  if (!resume) {
    return NextResponse.json([]);
  }

  const work = await prisma.work.findMany({
    where: { resumeId: resume.id },
    orderBy: [{ startYear: "desc" }, { startMonth: "desc" }],
  });

  return NextResponse.json(work);
}

export async function POST(request: Request) {
  const body = await request.json();

  const resume = await prisma.resume.findFirst();
  if (!resume) {
    return NextResponse.json({ error: "No profile found" }, { status: 400 });
  }

  const work = await prisma.work.create({
    data: {
      company: body.company,
      url: body.url ?? "",
      position: body.position ?? "",
      description: body.description ?? "",
      startMonth: body.startMonth ?? 0,
      startYear: body.startYear ?? 0,
      endMonth: body.endMonth ?? 0,
      endYear: body.endYear ?? 0,
      current: body.current ?? false,
      resumeId: resume.id,
    },
  });

  return NextResponse.json(work, { status: 201 });
}
