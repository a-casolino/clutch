import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import revalidateCache, { getAllTags, getAppPages } from 'clutch/helpers/revalidate-cache.js';

export async function GET(request) {
  const tags = request.nextUrl.searchParams.get('tags');
  const pages = request.nextUrl.searchParams.get('pages');
  const token = request.nextUrl.searchParams.get('token');

  if (!token || token !== process.env.ISR_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!pages && !tags) {
    for (const page of await getAppPages()) {
      revalidatePath(page);
    }
    for (const tag of await getAllTags()) {
      revalidateTag(tag);
    }
    return NextResponse.json({ success: true, fullRevalidate: true });
  }

  const tagsArray = tags && tags.split(',');
  const pagesArray = pages && pages.split(',');

  revalidateCache(tagsArray, pagesArray);

  return NextResponse.json({ success: true, fullRevalidate: false });
}

