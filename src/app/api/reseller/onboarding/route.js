export async function POST(req) {
  try {
    const body = await req.json()
    // Stub persistence: echo data back for now
    return new Response(
      JSON.stringify({ ok: true, received: body }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
}