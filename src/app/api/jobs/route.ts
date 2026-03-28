import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const resume = await prisma.resume.findFirst();
  if (!resume) {
    return NextResponse.json([]);
  }

  const jobs = await prisma.job.findMany({
    where: { resumeId: resume.id },
    include: { _count: { select: { postings: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const resume = await prisma.resume.findFirst();
  if (!resume) {
    return NextResponse.json({ error: "No profile found" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      title: title.trim(),
      resumeId: resume.id,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
