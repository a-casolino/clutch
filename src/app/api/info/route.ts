export async function GET() {
  const wpUrl = process.env.WORDPRESS_URL;
  const token = process.env.ISR_TOKEN;

  if (!wpUrl) {
    return new Response('WordPress URL is not configured', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  const integrationEndpoint = {
    url: wpUrl,
    invalidationEndpoint: `${wpUrl}api/isr`,
    token,
  };

  return new Response(JSON.stringify(integrationEndpoint), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
