import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleApiRoute } from '../../server/apiRouter';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  req.url = '/api/tts/synthesize';
  await handleApiRoute(req, res);
}

