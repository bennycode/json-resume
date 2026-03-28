import { NextRequest, NextResponse } from "next/server";
import { render, pdf } from "resumed";
import { buildResumeJson } from "@/lib/buildResumeJson";
import { loadTheme } from "@/lib/themes";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const jobId = searchParams.get("jobId") || undefined;
  const themeId = searchParams.get("themeId");

  if (!themeId) {
    return NextResponse.json({ error: "themeId is required" }, { status: 400 });
  }

  try {
    const [resumeJson, theme] = await Promise.all([
      buildResumeJson(jobId),
      Promise.resolve(loadTheme(themeId)),
    ]);

    const html = await render(resumeJson, theme);
    const pdfBuffer = await pdf(html, resumeJson, theme, {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"resume.pdf\"",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
