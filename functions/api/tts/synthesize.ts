// Cloudflare Pages adapter. Keys belong only to the protected API Worker.
import { protectedTtsProxy } from '../../../server/protectedTtsProxy';
type PagesContext = { request: Request };
export const onRequestPost = async ({ request }: PagesContext): Promise<Response> => {
  if (Number(request.headers.get('Content-Length') || 0) > 24000) return Response.json({ error: 'too_large' }, { status: 413 });
  return protectedTtsProxy(await request.text());
};
