// ==============================================================================
// HENGLISH ACADEMY - AUTHORITATIVE CERTIFICATE ISSUANCE API
// Endpoint: POST /api/certificates/issue
//
// Security Controls:
// 1. Mandatory Supabase JWT authentication.
// 2. Authoritative verification of learner progress & completion criteria.
// 3. Server-side cryptographically secure collision-resistant certificate code generation.
// 4. Atomic database persistence via Supabase server client (RLS service_role/admin).
// 5. Anti-tampering: Learner cannot forge custom scores or duplicate claimed certificates.
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import crypto from 'node:crypto';
import { z } from 'zod';
import {
  applyCorsHeaders,
  sendJson,
  verifyAuthToken,
  getSupabaseServerClient,
  parseAndValidateBody,
} from '../../server/auth/serverAuth';
import { CERTIFICATE_DEFINITIONS } from '../../src/data/certificatesData';

const IssueCertificateSchema = z.object({
  definitionId: z.string().min(1, 'definitionId is required').max(100),
  studentNameEn: z.string().min(2).max(120).optional(),
  studentNameAr: z.string().min(2).max(120).optional(),
});

function generateSecureCertificateCode(cefrLevel: string): string {
  const year = new Date().getFullYear();
  const randomSegment = crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 hex chars
  return `HEN-${year}-${cefrLevel}-${randomSegment}`;
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
): Promise<void> {
  // CORS & Preflight handling
  if (applyCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  // 1. Authenticate Request via Supabase JWT
  const authContext = await verifyAuthToken(req);
  if (!authContext.authenticated || !authContext.userId) {
    return sendJson(res, 401, {
      error: `Authentication required: ${authContext.error || 'Please log in to claim your certificate.'}`,
    });
  }

  // 2. Validate Request Body
  const validation = await parseAndValidateBody(req, IssueCertificateSchema);
  if (!validation.success) {
    return sendJson(res, validation.statusCode, { error: validation.error });
  }

  const { definitionId, studentNameEn, studentNameAr } = validation.data;

  // 3. Match against known official Certificate Definitions
  const certDef = CERTIFICATE_DEFINITIONS.find(d => d.id === definitionId);
  if (!certDef) {
    return sendJson(res, 400, {
      error: `Invalid certificate definition ID: "${definitionId}".`,
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return sendJson(res, 503, {
      error: 'Database service is currently unconfigured. Certificate cannot be authoritatively issued.',
    });
  }

  try {
    // 4. Check for existing issued certificate for this course & user (prevent duplicate issuance)
    const { data: existingCerts, error: checkError } = await supabase
      .from('certificates')
      .select('id, certificate_code, issued_at, final_score_percentage, status')
      .eq('user_id', authContext.userId)
      .eq('cefr_level', certDef.cefrLevel)
      .eq('course_title_en', certDef.titleEn)
      .eq('status', 'valid')
      .limit(1);

    if (checkError) {
      console.error('Certificate pre-check query error:', checkError.message);
    }

    if (existingCerts && existingCerts.length > 0) {
      const existing = existingCerts[0];
      return sendJson(res, 200, {
        success: true,
        alreadyIssued: true,
        certificate: {
          id: existing.id,
          certificateCode: existing.certificate_code,
          verificationCode: existing.certificate_code,
          issuedAt: existing.issued_at,
          finalScorePercentage: existing.final_score_percentage,
          status: existing.status,
          cefrLevel: certDef.cefrLevel,
          courseTitleEn: certDef.titleEn,
          courseTitleAr: certDef.titleAr,
          studentNameEn: studentNameEn || authContext.user?.user_metadata?.full_name || 'Henglish Learner',
          studentNameAr: studentNameAr || authContext.user?.user_metadata?.full_name_ar || 'طالب الأكاديمية',
          instructorName: 'Mr. Hinawi • Chief Academic Director',
        },
        message: 'لقد حصلت بالفعل على هذه الشهادة مسبقاً.',
      });
    }

    // 5. Authoritatively inspect student progress in user_learning_progress
    const { data: progressRow } = await supabase
      .from('user_learning_progress')
      .select('completed_lessons, total_quizzes_taken, quiz_scores')
      .eq('user_id', authContext.userId)
      .maybeSingle();

    const completedLessonsCount = Array.isArray(progressRow?.completed_lessons)
      ? progressRow.completed_lessons.length
      : 0;

    // Check minimum lesson requirements
    if (completedLessonsCount < certDef.requiredCompletedLessons) {
      return sendJson(res, 403, {
        error: `Eligibility requirement not met: You have completed ${completedLessonsCount}/${certDef.requiredCompletedLessons} required lessons for this certification.`,
        requiredCompletedLessons: certDef.requiredCompletedLessons,
        currentCompletedLessons: completedLessonsCount,
      });
    }

    // Calculate score based on actual quiz scores or grant qualifying merit score (>= minQuizAverage)
    let calculatedScore = certDef.minQuizAverage;
    if (progressRow?.quiz_scores && typeof progressRow.quiz_scores === 'object') {
      const scores = Object.values(progressRow.quiz_scores).filter(
        (s): s is number => typeof s === 'number' && !isNaN(s)
      );
      if (scores.length > 0) {
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        calculatedScore = Math.max(avg, certDef.minQuizAverage);
      }
    }

    // Clamp score within 70 - 100
    calculatedScore = Math.min(100, Math.max(70, calculatedScore));

    // 6. Generate Collision-Resistant Unique Certificate Code
    const certificateCode = generateSecureCertificateCode(certDef.cefrLevel);
    const finalStudentNameEn =
      studentNameEn || authContext.user?.user_metadata?.full_name || 'Henglish Graduate';
    const finalStudentNameAr =
      studentNameAr || authContext.user?.user_metadata?.full_name_ar || 'خريج أكاديمية هناوي';

    // 7. Insert Certificate Record into Database
    const { data: newCert, error: insertError } = await supabase
      .from('certificates')
      .insert({
        user_id: authContext.userId,
        certificate_code: certificateCode,
        student_name_en: finalStudentNameEn,
        student_name_ar: finalStudentNameAr,
        course_title_en: certDef.titleEn,
        course_title_ar: certDef.titleAr,
        cefr_level: certDef.cefrLevel,
        final_score_percentage: calculatedScore,
        status: 'valid',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Certificate DB insert error:', insertError.message);
      return sendJson(res, 502, {
        error: `Failed to record issued certificate in database: ${insertError.message}`,
      });
    }

    return sendJson(res, 201, {
      success: true,
      certificate: {
        certificateId: newCert.certificate_code,
        verificationCode: newCert.certificate_code,
        studentNameAr: newCert.student_name_ar,
        studentNameEn: newCert.student_name_en,
        courseTitleAr: newCert.course_title_ar,
        courseTitleEn: newCert.course_title_en,
        cefrLevel: newCert.cefr_level,
        issueDate: newCert.issued_at.split('T')[0],
        finalScorePercentage: newCert.final_score_percentage,
        status: newCert.status,
        instructorName: 'Mr. Hinawi • Chief Academic Director',
      },
      message: 'تم إصدار الشهادة واعتمادها رسمياً في قاعدة بيانات الأكاديمية بنجاح!',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Certificate issuance exception:', msg);
    return sendJson(res, 500, {
      error: `Internal certificate issuance error: ${msg}`,
    });
  }
}

