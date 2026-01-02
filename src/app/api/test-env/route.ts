import { NextResponse } from "next/server";

export async function GET() {
  const rawProvider = process.env.AI_PROVIDER || 'not set';
  const trimmedProvider = rawProvider !== 'not set' ? rawProvider.trim() : rawProvider;

  return NextResponse.json({
    AI_PROVIDER_raw: rawProvider,
    AI_PROVIDER_trimmed: trimmedProvider,
    AI_PROVIDER_length: rawProvider !== 'not set' ? rawProvider.length : 0,
    AI_PROVIDER_match_deepseek: trimmedProvider.toLowerCase() === 'deepseek',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? 'configured' : 'not set',
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL || 'not set',
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL || 'not set',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'configured' : 'not set',
  });
}
