import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect');
  const authToken = searchParams.get('token');

  if (!redirectUrl) {
    return new Response('Missing redirect parameter', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (!authToken) {
    return new Response('Missing token parameter', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Enable draft mode
  (await draftMode()).enable();

  const cookieStore = await cookies();
  const prerenderBypass = cookieStore.get('__prerender_bypass')?.value;

  if (prerenderBypass) {
    cookieStore.set('__prerender_bypass', prerenderBypass, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      path: '/',
    });
  }

  if (authToken) {
    cookieStore.set('wpAuthToken', authToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      path: '/',
    });
  }

  // Redirect the user to the specified URL
  redirect(redirectUrl);
}
