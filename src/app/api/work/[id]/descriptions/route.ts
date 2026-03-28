import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const descriptions = await prisma.workJobDescription.findMany({
    where: { workId: id },
    include: { job: { select: { id: true, title: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(descriptions);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const desc = await prisma.workJobDescription.create({
    data: { workId: id, jobId: body.jobId, description: "" },
    include: { job: { select: { id: true, title: true } } },
  });

  return NextResponse.json(desc, { status: 201 });
}
