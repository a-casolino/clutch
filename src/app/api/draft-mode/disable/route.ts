import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect');

  // Disable draft mode
  (await draftMode()).disable();

  const cookieStore = await cookies();
  cookieStore.delete('wpAuthToken', {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    path: '/',
  });

  // Redirect the user to the specified URL
  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
