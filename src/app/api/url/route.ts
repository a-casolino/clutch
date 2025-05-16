
import { resolveLink } from '@clutch-marketplace/clutch.wordpress/dist/lib/resolvers/links';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const permalink = searchParams.get('permalink');

  if (!permalink) {
    return new Response('Missing permalink parameter', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const resolvedUrl = await resolveLink(permalink);

    return new Response(JSON.stringify({ resolvedUrl }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response('Error resolving permalink', {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
