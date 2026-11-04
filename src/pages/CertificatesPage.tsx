import React, { useState, useEffect } from "react";
import { PageRoute, UserProfile } from "../types";
import {
  CERTIFICATE_DEFINITIONS,
  INITIAL_ISSUED_CERTIFICATES,
  IssuedCertificate,
  CertificateDefinition,
} from "../data/certificatesData";
import {
  claimCertificateOnServer,
  verifyCertificateOnServer,
  fetchUserCertificates,
} from "../services/certificateService";
import { playSound, fireCelebration } from "../utils/audio";
import {
  Award,
  CheckCircle2,
  Lock,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  X,
  FileCheck2,
  Calendar,
  Building,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CertificatesPageProps {
  onNavigate: (route: PageRoute) => void;
  userProfile: UserProfile;
  completedLessonsCount: number;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({
  onNavigate,
  userProfile,
  completedLessonsCount,
}) => {
  const [issuedCerts, setIssuedCerts] = useState<IssuedCertificate[]>(
    INITIAL_ISSUED_CERTIFICATES,
  );
  const [selectedCertificate, setSelectedCertificate] =
    useState<IssuedCertificate | null>(INITIAL_ISSUED_CERTIFICATES[0]);
  const [searchVerifyCode, setSearchVerifyCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<
    IssuedCertificate | null | "not-found"
  >(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isClaiming, setIsClaiming] = useState<string | null>(null);
  const [claimErrorMessage, setClaimErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserCertificates().then((certs) => {
      if (certs.length > 0) {
        setIssuedCerts(certs);
        setSelectedCertificate(certs[0]);
      }
    });
  }, []);

  const handlePrintCertificate = () => {
    playSound("click");
    window.print();
  };

  const handleVerifySearch = async () => {
    const trimmed = searchVerifyCode.trim().toUpperCase();
    if (!trimmed) return;
    playSound("click");
    setIsVerifying(true);
    setVerificationResult(null);

    const res = await verifyCertificateOnServer(trimmed);
    setIsVerifying(false);

    if (res.valid && res.certificate) {
      setVerificationResult(res.certificate);
      playSound("correct");
    } else {
      setVerificationResult("not-found");
      playSound("wrong");
    }
  };

  const handleClaimCertificate = async (def: CertificateDefinition) => {
    playSound("click");
    setIsClaiming(def.id);
    setClaimErrorMessage(null);

    const res = await claimCertificateOnServer(
      def.id,
      userProfile.name,
      userProfile.nameAr
    );
    setIsClaiming(null);

    if (res.success && res.certificate) {
      playSound("correct");
      fireCelebration();
      setIssuedCerts((prev) => [
        res.certificate!,
        ...prev.filter((c) => c.certificateId !== res.certificate!.certificateId),
      ]);
      setSelectedCertificate(res.certificate);
    } else {
      playSound("wrong");
      setClaimErrorMessage(
        res.error || "تعذر إصدار الشهادة. يرجى التأكد من استيفاء المتطلبات."
      );
    }
  };

  return (
    <div className="space-y-12 pb-16 text-right max-w-5xl mx-auto">
      {/* 1. HERO HEADER */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#171632] via-[#0c0b20] to-[#1a1438] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30 shadow-sm">
            <Award className="w-4 h-4" />
            <span>
              ACADEMIC CERTIFICATES & DIPLOMAS • الشهادات المعتمدة والتوثيق
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            شهادات الإنجاز الأكاديمي والتحقق الرسمي 📜
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            احصل على شهادات إتمام المستويات المعتمدة من أكاديمية هناوي بعد
            اجتياز دروس القواعد والاختبارات التفاعلية، مع كود تحقق مشفر وفريد
            لكل شهادة.
          </p>
        </div>
      </section>

      {/* 2. PUBLIC CERTIFICATE VERIFICATION TOOL */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#41e7ff]" />
              <span>
                التحقق من صحة الشهادة الأكاديمية (Public Verification)
              </span>
            </h3>
            <p className="text-xs text-[#b9b6d5]">
              أدخل كود الشهادة الفريد (مثال: HEN-2026-FP-8492) للتحقق الفوري من
              مصداقيتها وتاريخ إصدارها.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              dir="ltr"
              lang="en"
              value={searchVerifyCode}
              onChange={(e) => setSearchVerifyCode(e.target.value)}
              placeholder="e.g. HEN-2026-FP-8492"
              className="english-input px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs uppercase focus:outline-none focus:border-[#41e7ff] w-full sm:w-56"
            />
            <button
              onClick={handleVerifySearch}
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#ffd166] text-[#0c0b20] text-xs font-black hover:brightness-110 shadow-md cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جارٍ التحقق...</span>
                </>
              ) : (
                <span>تحقق الآن</span>
              )}
            </button>
          </div>
        </div>

        {/* Verification Result Feedback */}
        {verificationResult && verificationResult !== "not-found" && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>شهادة رسمية موثقة وسارية المفعول ✅</span>
              </div>
              <div className="text-sm font-bold text-white">
                الطالب: {verificationResult.studentNameAr} (
                {verificationResult.studentNameEn})
              </div>
              <div className="text-xs text-[#dedbf4]">
                المسار: {verificationResult.courseTitleAr} • النتيجة النهائية:{" "}
                {verificationResult.finalScorePercentage}%
              </div>
            </div>
            <button
              onClick={() => setSelectedCertificate(verificationResult)}
              className="text-xs font-bold text-[#ffd166] hover:underline cursor-pointer shrink-0 self-center"
            >
              عرض الشهادة 🔍
            </button>
          </div>
        )}

        {verificationResult === "not-found" && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <span>
              ❌ لم يتم العثور على شهادة مسجلة بهذا الكود. يرجى التأكد من صحة
              الرمز المدخل.
            </span>
          </div>
        )}
      </section>

      {/* 3. ACTIVE CERTIFICATE LUXURY RENDERER (PRINTABLE) */}
      {selectedCertificate && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ffd166]" />
              <span>معاينة الشهادة المعتمدة</span>
            </h3>

            <button
              onClick={handlePrintCertificate}
              className="px-5 py-2.5 rounded-xl bg-[#ffd166] text-[#0c0b20] font-black text-xs hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ كملف PDF</span>
            </button>
          </div>

          {/* Decorative Certificate Frame */}
          <div className="relative rounded-3xl bg-linear-to-br from-[#121128] via-[#1a1738] to-[#0c0b20] p-6 sm:p-12 border-4 border-[#ffd166]/60 shadow-[0_0_50px_rgba(255,209,102,0.15)] text-center space-y-6">
            {/* Corner Decorative Accents */}
            <div className="absolute top-4 left-4 text-xs font-mono text-[#ffd166]/50">
              ✦ ✦ ✦
            </div>
            <div className="absolute top-4 right-4 text-xs font-mono text-[#ffd166]/50">
              ✦ ✦ ✦
            </div>
            <div className="absolute bottom-4 left-4 text-xs font-mono text-[#ffd166]/50">
              ✦ ✦ ✦
            </div>
            <div className="absolute bottom-4 right-4 text-xs font-mono text-[#ffd166]/50">
              ✦ ✦ ✦
            </div>

            {/* Header Logos & Crest */}
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffd166] to-[#ff9c66] text-3xl shadow-xl">
                🦅
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wider text-[#ffd166] uppercase font-serif">
                Henglish Academy
              </h2>
              <div className="text-xs text-[#b9b6d5] font-mono tracking-widest uppercase">
                Certificate of Academic Achievement
              </div>
            </div>

            {/* Certificate Body */}
            <div className="space-y-3 max-w-2xl mx-auto py-4">
              <p className="text-xs text-[#dedbf4]">
                This is to proudly certify that
              </p>
              <div className="text-3xl sm:text-4xl font-black text-white font-serif tracking-wide border-b border-[#ffd166]/40 pb-2 inline-block px-8">
                {selectedCertificate.studentNameEn}
              </div>
              <div className="text-lg font-bold text-[#ffd166]">
                {selectedCertificate.studentNameAr}
              </div>
              <p className="text-xs sm:text-sm text-[#dedbf4] leading-relaxed pt-2">
                has successfully completed all requirements, practical
                assessments, and masterclass examinations for:
              </p>
              <div className="text-xl sm:text-2xl font-black text-[#41e7ff]">
                {selectedCertificate.courseTitleEn}
              </div>
              <div className="text-xs font-semibold text-[#b9b6d5]">
                {selectedCertificate.courseTitleAr} • CEFR Level:{" "}
                {selectedCertificate.cefrLevel}
              </div>
            </div>

            {/* Seals & Signatures */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-[#b9b6d5] block">
                  Date of Issuance:
                </span>
                <span className="font-mono font-bold text-white">
                  {selectedCertificate.issueDate}
                </span>
              </div>

              {/* Academy Embossed Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#ffd166] flex flex-col items-center justify-center text-[9px] font-black text-[#ffd166] uppercase shadow-lg">
                  <span>Official</span>
                  <span>Seal</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-[#b9b6d5] block">
                  Authorized Signature:
                </span>
                <span className="font-serif italic font-bold text-[#ffd166] text-sm block">
                  Mr. Hinawi
                </span>
                <span className="text-[9px] text-[#b9b6d5]">
                  Chief Academic Director
                </span>
              </div>
            </div>

            {/* Verification Footer & Legal Disclaimer */}
            <div className="pt-4 text-[10px] text-[#b9b6d5]/70 space-y-1 border-t border-white/5">
              <div className="font-mono text-[#ffd166]">
                Verification ID: {selectedCertificate.verificationCode}
              </div>
              <div>
                تنويه: هذه الشهادة توثق الإنجاز الأكاديمي الداخلي لمقررات منصة
                أكاديمية هناوي، ولا تدعي أنها بديل عن اختبارات الهيئات الحكومية
                أو شهادات IELTS/TOEFL الرسمية.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. ALL AVAILABLE CERTIFICATES CATALOG & PROGRESS */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-[#ffd166]" />
          <span>مسارات الشهادات المتاحة وشروط استحقاقها</span>
        </h3>

        {claimErrorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{claimErrorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CERTIFICATE_DEFINITIONS.map((def) => {
            const isEligible =
              completedLessonsCount >= def.requiredCompletedLessons;

            return (
              <div
                key={def.id}
                className={`p-6 rounded-3xl border text-right transition-all flex flex-col justify-between space-y-4 ${
                  isEligible
                    ? "glass-panel border-[#ffd166]/40 shadow-lg"
                    : "bg-white/5 border-white/10 opacity-70"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{def.badgeIcon}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ffd166]/20 text-[#ffd166]">
                      Level {def.cefrLevel}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white">
                    {def.titleAr}
                  </h4>
                  <div className="text-xs font-mono text-[#41e7ff]">
                    {def.titleEn}
                  </div>
                  <p className="text-xs text-[#dedbf4] leading-relaxed">
                    {def.descriptionAr}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold text-[#b9b6d5]">
                    <span>شرط الإنجاز:</span>
                    <span>{def.requiredCompletedLessons} دروس مكتملة</span>
                  </div>

                  {isEligible ? (
                    <button
                      onClick={() => handleClaimCertificate(def)}
                      disabled={isClaiming === def.id}
                      className="w-full py-2.5 rounded-xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs hover:brightness-110 shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isClaiming === def.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جارٍ الاعتماد والتوثيق...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>إصدار وعرض الشهادة الآن 🎉</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-black/40 text-xs text-[#b9b6d5] border border-white/10">
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        أكمل{" "}
                        {def.requiredCompletedLessons - completedLessonsCount}{" "}
                        دروس إضافية للفتح
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
