export async function GET({ request }) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  const apiUrl = date
    ? `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.NASA_API_KEY}&date=${date}`
    : `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.NASA_API_KEY}`;

  const res = await fetch(apiUrl, {
    // Don't cache the NASA API request either
    cache: 'no-store'
  });
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      // Multiple cache-busting headers for maximum effectiveness
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  });
}
