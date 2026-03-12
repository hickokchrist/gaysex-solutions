export const prerender = false;

export async function POST({ request }) {
  const { token } = await request.json();
  
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  
  const data = await res.json();
  return new Response(JSON.stringify({ success: data.success }), {
    headers: { 'Content-Type': 'application/json' }
  });
}