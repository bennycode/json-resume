import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, company, url, description, responsibilities, skills } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const posting = await prisma.posting.create({
    data: {
      title: title.trim(),
      company: company ?? "",
      url: url ?? "",
      description: description ?? "",
      responsibilities: responsibilities ?? "",
      skills: skills ?? "",
      jobId: id,
    },
  });

  return NextResponse.json(posting, { status: 201 });
}
