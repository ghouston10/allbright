import { NextResponse } from "next/server";
import workers from "./data.json";

export async function GET() {
  return NextResponse.json(workers);
}
