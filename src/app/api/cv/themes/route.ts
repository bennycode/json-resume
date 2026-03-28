import { getInstalledThemes } from "@/lib/themes";
import { NextResponse } from "next/server";

export async function GET() {
  const themes = getInstalledThemes();
  return NextResponse.json(themes);
}
