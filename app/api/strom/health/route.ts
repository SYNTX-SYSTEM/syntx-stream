// app/api/strom/health/route.ts - CORS Proxy
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://dev.syntx-system.com/strom/health')
    const data = await response.json()
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'API connection failed' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}
