import { NextResponse } from 'next/server';

const API_BASE = 'https://dev.syntx-system.com/api/strom';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/strom/crud`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch streams' }, { status: 500 });
  }
}
