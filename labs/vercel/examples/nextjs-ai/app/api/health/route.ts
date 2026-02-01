export const runtime = 'edge';

export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: 'edge',
    version: '1.0.0',
  });
}
