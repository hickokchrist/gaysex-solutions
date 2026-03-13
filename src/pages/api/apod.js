export async function GET({ request }) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  const apiUrl = date
    ? `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.NASA_API_KEY}&date=${date}`
    : `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.NASA_API_KEY}`;

  const res = await fetch(apiUrl);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
