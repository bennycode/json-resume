import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const posting = await prisma.posting.update({
    where: { id },
    data: {
      title: body.title,
      company: body.company,
      url: body.url,
      description: body.description,
      responsibilities: body.responsibilities,
      skills: body.skills,
    },
  });

  return NextResponse.json(posting);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.posting.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
