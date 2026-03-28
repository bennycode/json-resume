import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const work = await prisma.work.findUnique({ where: { id } });
  if (!work) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(work);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const work = await prisma.work.update({
    where: { id },
    data: {
      company: body.company,
      url: body.url,
      position: body.position,
      description: body.description,
      startMonth: body.startMonth,
      startYear: body.startYear,
      endMonth: body.endMonth,
      endYear: body.endYear,
      current: body.current,
    },
  });

  return NextResponse.json(work);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.work.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
