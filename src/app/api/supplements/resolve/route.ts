import { NextRequest, NextResponse } from "next/server";
import { findSupplement } from "@/lib/supplement-db";

export async function POST(request: NextRequest) {
  try {
    const { names } = await request.json();

    if (!Array.isArray(names)) {
      return NextResponse.json({ error: "Names must be an array" }, { status: 400 });
    }

    const results = await Promise.all(
      names.map(async (name) => {
        const match = await findSupplement(name);
        return {
          original: name,
          found: !!match,
          match: match
        };
      })
    );

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ error: "Failed to resolve supplements" }, { status: 500 });
  }
}
