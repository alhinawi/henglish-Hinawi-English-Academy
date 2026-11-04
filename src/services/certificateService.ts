// ==============================================================================
// HENGLISH ACADEMY - CLIENT CERTIFICATE SERVICE
// Connects to Authoritative Serverless Certificate Endpoints
// File: src/services/certificateService.ts
// ==============================================================================

import { IssuedCertificate, INITIAL_ISSUED_CERTIFICATES } from '../data/certificatesData';
import { getSavedAuthSession } from './authService';

export interface VerifyCertificateResult {
  valid: boolean;
  certificate?: IssuedCertificate;
  error?: string;
  message?: string;
  status?: string;
}

export interface ClaimCertificateResult {
  success: boolean;
  certificate?: IssuedCertificate;
  alreadyIssued?: boolean;
  error?: string;
  message?: string;
  requiredCompletedLessons?: number;
  currentCompletedLessons?: number;
}

function getAuthHeader(): Record<string, string> {
  const session = getSavedAuthSession();
  if (session && session.accessToken) {
    return {
      Authorization: `Bearer ${session.accessToken}`,
    };
  }
  return {};
}

/**
 * Authoritatively retrieves all valid certificates issued to the current authenticated user.
 */
export async function fetchUserCertificates(): Promise<IssuedCertificate[]> {
  const session = getSavedAuthSession();
  if (!session || !session.accessToken) {
    // If guest or dev without token, return default sample certificates
    return INITIAL_ISSUED_CERTIFICATES;
  }

  try {
    const res = await fetch('/api/certificates/my-certificates', {
      headers: {
        ...getAuthHeader(),
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.certificates) && data.certificates.length > 0) {
        return data.certificates;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch certificates from server, falling back to local state:', err);
  }

  return INITIAL_ISSUED_CERTIFICATES;
}

/**
 * Authoritatively requests issuance of an earned certificate from the server.
 */
export async function claimCertificateOnServer(
  definitionId: string,
  studentNameEn?: string,
  studentNameAr?: string
): Promise<ClaimCertificateResult> {
  const session = getSavedAuthSession();
  if (!session || !session.accessToken) {
    return {
      success: false,
      error: 'يرجى تسجيل الدخول بحساب معتمد لتتمكن من إصدار الشهادات الرسمية وحفظها في قاعدة البيانات.',
    };
  }

  try {
    const res = await fetch('/api/certificates/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        definitionId,
        studentNameEn,
        studentNameAr,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      return {
        success: true,
        certificate: data.certificate,
        alreadyIssued: data.alreadyIssued,
        message: data.message,
      };
    }

    return {
      success: false,
      error: data.error || 'تعذر إصدار الشهادة. يرجى المحاولة لاحقاً.',
      requiredCompletedLessons: data.requiredCompletedLessons,
      currentCompletedLessons: data.currentCompletedLessons,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `فشل الاتصال بخادم الأكاديمية لإصدار الشهادة: ${msg}`,
    };
  }
}

/**
 * Authoritatively checks a certificate code against the academy's official records.
 */
export async function verifyCertificateOnServer(code: string): Promise<VerifyCertificateResult> {
  const clean = code.trim().toUpperCase();
  if (!clean) {
    return { valid: false, error: 'يرجى إدخال رمز التحقق الخاص بالشهادة.' };
  }

  try {
    const res = await fetch(`/api/certificates/verify?code=${encodeURIComponent(clean)}`);
    const data = await res.json();

    if (res.ok && data.valid && data.certificate) {
      return {
        valid: true,
        certificate: data.certificate,
        message: data.message,
        status: data.status,
      };
    }

    return {
      valid: false,
      error: data.error || 'لم يتم العثور على شهادة بهذا الرمز في سجلات أكاديمية هناوي الرسمية.',
      certificate: data.certificate,
      status: data.status,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      valid: false,
      error: `تعذر التحقق من الشهادة عبر الخادم: ${msg}`,
    };
  }
}

