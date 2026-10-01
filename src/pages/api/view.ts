import type { APIRoute } from 'astro';

export const prerender = false;

const SUPABASE_URL = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_KEY  = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

const BOT  = /bot|crawl|spider|slurp|headless|preview|lighthouse|monitor|facebookexternalhit/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const str = (v: unknown, max: number) =>
  typeof v === 'string' && v.length ? v.slice(0, max) : null;
const int = (v: unknown, max = 100000) =>
  typeof v === 'number' && isFinite(v) ? Math.min(Math.max(Math.round(v), 0), max) : null;

function country(request: Request) {
  const raw = request.headers.get('x-nf-geo');
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'))?.country?.code ?? null;
  } catch { return null; }
}

export const POST: APIRoute = async ({ request }) => {
  console.log('env check:', !!SUPABASE_URL, !!SERVICE_KEY);	
  if (!SUPABASE_URL || !SERVICE_KEY) return new Response(null, { status: 500 });

  let body: any;
  try { body = await request.json(); } catch { return new Response(null, { status: 400 }); }
  if (!UUID.test(body?.view_id ?? '')) return new Response(null, { status: 400 });

  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal'
  };

  // --- second send: engagement data, fired as the visitor leaves ---
  if (body.phase === 'leave') {
    const cutoff = new Date(Date.now() - 6 * 3600 * 1000).toISOString();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/page_views` +
      `?view_id=eq.${body.view_id}&occurred_at=gte.${cutoff}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          duration_ms:    int(body.duration_ms, 86_400_000),
          max_scroll_pct: int(body.max_scroll_pct, 100)
        })
      }
    );
    return new Response(null, { status: res.ok ? 204 : 500 });
  }

  // --- first send: the page view itself ---
  const row = {
    view_id:    body.view_id,
    path:       str(body.path, 512) ?? '/',
    page_title: str(body.page_title, 300),
    country:    country(request),
    screen_w:   int(body.screen_w),
    screen_h:   int(body.screen_h),
    viewport_w: int(body.viewport_w),
    viewport_h: int(body.viewport_h),
    load_ms:    int(body.load_ms, 600000),
    is_bot:     BOT.test(request.headers.get('user-agent') ?? '')
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
    method: 'POST',
    headers,
    body: JSON.stringify(row)
  });

  return new Response(null, { status: res.ok ? 204 : 500 });
};