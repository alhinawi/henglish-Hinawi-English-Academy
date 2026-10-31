import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleApiRoute } from '../../server/apiRouter';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  req.url = '/api/ai/stream';
  await handleApiRoute(req, res);
}

