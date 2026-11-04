// ==============================================================================
// HENGLISH ACADEMY - USER CERTIFICATES RETRIEVAL API
// Endpoint: GET /api/certificates/my-certificates
//
// Security Controls:
// 1. Mandatory Supabase JWT verification.
// 2. Strict tenant isolation (queries WHERE user_id = authContext.userId).
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  applyCorsHeaders,
  sendJson,
  verifyAuthToken,
  getSupabaseServerClient,
} from '../../server/auth/serverAuth';

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  // CORS & Preflight handling
  if (applyCorsHeaders(req, res)) return;

  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method Not Allowed. Use GET.' });
  }

  const authContext = await verifyAuthToken(req);
  if (!authContext.authenticated || !authContext.userId) {
    return sendJson(res, 401, {
      error: `Authentication required: ${authContext.error || 'Please log in to view your certificates.'}`,
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return sendJson(res, 503, {
      error: 'Database service is currently unconfigured.',
      certificates: [],
    });
  }

  try {
    const { data: certs, error } = await supabase
      .from('certificates')
      .select(
        'id, certificate_code, student_name_en, student_name_ar, course_title_en, course_title_ar, cefr_level, final_score_percentage, issued_at, status'
      )
      .eq('user_id', authContext.userId)
      .order('issued_at', { ascending: false });

    if (error) {
      console.error('Fetch user certificates DB error:', error.message);
      return sendJson(res, 502, {
        error: `Database query error: ${error.message}`,
        certificates: [],
      });
    }

    const formatted = (certs || []).map(c => ({
      certificateId: c.certificate_code,
      verificationCode: c.certificate_code,
      studentNameAr: c.student_name_ar,
      studentNameEn: c.student_name_en,
      courseTitleAr: c.course_title_ar,
      courseTitleEn: c.course_title_en,
      cefrLevel: c.cefr_level,
      finalScorePercentage: c.final_score_percentage,
      issueDate: c.issued_at ? c.issued_at.split('T')[0] : '',
      status: c.status,
      instructorName: 'Mr. Hinawi • Chief Academic Director',
    }));

    return sendJson(res, 200, {
      success: true,
      certificates: formatted,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Fetch user certificates exception:', msg);
    return sendJson(res, 500, {
      error: `Internal server error: ${msg}`,
      certificates: [],
    });
  }
}

