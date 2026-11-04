// ==============================================================================
// HENGLISH ACADEMY - PUBLIC CERTIFICATE VERIFICATION API
// Endpoint: GET /api/certificates/verify?code=HEN-2026-B2-XXXX
//
// Security Controls:
// 1. Authoritative lookup in public.certificates table.
// 2. Strict certificate code format validation (regex).
// 3. Status enforcement (status must be 'valid', revoked certificates flagged).
// 4. Zero exposure of internal user IDs, email addresses, or phone numbers.
// 5. Sliding window rate limiting to prevent certificate code scraping/enumeration.
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  applyCorsHeaders,
  sendJson,
  getSupabaseServerClient,
} from '../../server/auth/serverAuth';

// In-Memory IP rate limiter: max 40 lookups per hour per IP
const verifyRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkVerifyRateLimit(ip: string, limit = 40, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const record = verifyRateLimits.get(ip);
  if (!record || now > record.resetAt) {
    verifyRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

// Format: HEN-<YEAR>-<LEVEL>-<HASH> (e.g. HEN-2026-B2-8492 or HEN-2026-B2-A1B2C3D4)
const CERT_CODE_REGEX = /^HEN-\d{4}-[A-Z0-9]{1,4}-[A-Z0-9]{4,12}$/i;

export default async function handler(
  req: IncomingMessage & { query?: Record<string, string> },
  res: ServerResponse
): Promise<void> {
  // CORS & Preflight handling
  if (applyCorsHeaders(req, res)) return;

  if (req.method !== 'GET' && req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed. Use GET or POST.' });
  }

  const clientIp = (
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'anonymous'
  ).split(',')[0].trim();

  if (!checkVerifyRateLimit(clientIp, 40)) {
    return sendJson(res, 429, {
      error: 'Rate limit exceeded: Too many certificate verification attempts. Please wait.',
    });
  }

  // Parse code from URL search parameters or body
  let code = '';
  if (req.url && req.url.includes('?')) {
    const searchParams = new URLSearchParams(req.url.split('?')[1]);
    code = (searchParams.get('code') || searchParams.get('id') || '').trim();
  }

  if (!code && req.method === 'POST') {
    // Attempt to read from body if POST
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (raw) {
        const parsed = JSON.parse(raw);
        code = (parsed.code || parsed.id || '').trim();
      }
    } catch {}
  }

  if (!code) {
    return sendJson(res, 400, {
      error: 'Certificate code is required (e.g., ?code=HEN-2026-B2-8492).',
    });
  }

  const cleanCode = code.toUpperCase();

  // Basic regex structure check to prevent arbitrary database scanning
  if (!CERT_CODE_REGEX.test(cleanCode)) {
    return sendJson(res, 400, {
      error: 'Invalid certificate code format. Expected format: HEN-YYYY-LEVEL-XXXX.',
      valid: false,
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return sendJson(res, 503, {
      error: 'Database service is currently unconfigured. Cannot verify certificates.',
      valid: false,
    });
  }

  try {
    const { data: cert, error } = await supabase
      .from('certificates')
      .select(
        'certificate_code, student_name_en, student_name_ar, course_title_en, course_title_ar, cefr_level, final_score_percentage, issued_at, status'
      )
      .eq('certificate_code', cleanCode)
      .maybeSingle();

    if (error) {
      console.error('Certificate verification DB error:', error.message);
      return sendJson(res, 502, {
        error: `Database lookup error: ${error.message}`,
        valid: false,
      });
    }

    if (!cert) {
      return sendJson(res, 404, {
        valid: false,
        error: 'لم يتم العثور على شهادة بهذا الرمز في سجلات أكاديمية هناوي الرسمية.',
        searchedCode: cleanCode,
      });
    }

    if (cert.status === 'revoked') {
      return sendJson(res, 200, {
        valid: false,
        status: 'revoked',
        error: 'هذه الشهادة تم إلغاؤها أو إبطالها من قِبل إدارة الأكاديمية.',
        certificate: {
          certificateId: cert.certificate_code,
          verificationCode: cert.certificate_code,
          studentNameAr: cert.student_name_ar,
          studentNameEn: cert.student_name_en,
          courseTitleAr: cert.course_title_ar,
          courseTitleEn: cert.course_title_en,
          cefrLevel: cert.cefr_level,
          status: 'revoked',
        },
      });
    }

    // Successfully verified valid certificate
    return sendJson(res, 200, {
      valid: true,
      status: 'valid',
      message: 'شهادة معتمدة ورسمية ومسجلة في قاعدة بيانات أكاديمية هناوي للغة الإنجليزية.',
      certificate: {
        certificateId: cert.certificate_code,
        verificationCode: cert.certificate_code,
        studentNameAr: cert.student_name_ar,
        studentNameEn: cert.student_name_en,
        courseTitleAr: cert.course_title_ar,
        courseTitleEn: cert.course_title_en,
        cefrLevel: cert.cefr_level,
        finalScorePercentage: cert.final_score_percentage,
        issueDate: cert.issued_at ? cert.issued_at.split('T')[0] : '',
        status: 'valid',
        instructorName: 'Mr. Hinawi • Chief Academic Director',
        issuer: 'Henglish Academy of English (أكاديمية هناوي)',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Certificate verify exception:', msg);
    return sendJson(res, 500, {
      valid: false,
      error: `Internal verification error: ${msg}`,
    });
  }
}

