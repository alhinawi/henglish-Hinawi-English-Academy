import React from "react";
import { GraduationCap } from "lucide-react";
import { IssuedCertificate } from "../data/certificatesData";

// Fixed A4-landscape certificate sheet (297mm x 210mm at 96dpi).
// Rendered off-screen for PDF capture and scaled on-screen so the
// downloaded file always matches what the user sees.
export const CERT_WIDTH = 1123;
export const CERT_HEIGHT = 794;

interface CertificateDocumentProps {
  cert: IssuedCertificate;
}

const formatDateEn = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  cert,
}) => {
  return (
    <div
      dir="ltr"
      style={{
        width: CERT_WIDTH,
        height: CERT_HEIGHT,
        background:
          "radial-gradient(ellipse 60% 50% at 50% 0%, #232052 0%, #14122e 55%, #0c0b20 100%)",
        fontFamily: "Georgia, 'Times New Roman', 'AmiriCert', serif",
        position: "relative",
        overflow: "hidden",
        color: "#ffffff",
      }}
    >
      {/* Outer gold frame */}
      <div
        style={{
          position: "absolute",
          inset: 14,
          border: "3px solid #d4af37",
          borderRadius: 18,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 22,
          border: "1px solid rgba(212,175,55,0.45)",
          borderRadius: 12,
          pointerEvents: "none",
        }}
      />
      {/* Corner flourishes */}
      {[
        { top: 30, left: 30, borderTop: true, borderLeft: true },
        { top: 30, right: 30, borderTop: true, borderRight: true },
        { bottom: 30, left: 30, borderBottom: true, borderLeft: true },
        { bottom: 30, right: 30, borderBottom: true, borderRight: true },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 42,
            height: 42,
            borderColor: "#ffd166",
            borderStyle: "solid",
            borderWidth: 0,
            ...(pos.borderTop ? { borderTopWidth: 4, top: pos.top } : {}),
            ...(pos.borderBottom
              ? { borderBottomWidth: 4, bottom: pos.bottom }
              : {}),
            ...(pos.borderLeft ? { borderLeftWidth: 4, left: pos.left } : {}),
            ...(pos.borderRight
              ? { borderRightWidth: 4, right: pos.right }
              : {}),
            borderRadius: 2,
          }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "52px 90px 40px",
          textAlign: "center",
        }}
      >
        {/* Crest */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "linear-gradient(135deg, #ffd166, #ff9c66)",
            padding: 3,
            boxShadow: "0 8px 30px rgba(255,209,102,0.35)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#171632",
              borderRadius: 17,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap width={38} height={38} color="#ffd166" />
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 6,
            color: "#ffd166",
          }}
        >
          HENGLISH ACADEMY
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            letterSpacing: 5,
            color: "#b9b6d5",
            fontFamily: "'Courier New', monospace",
          }}
        >
          CERTIFICATE OF ACADEMIC ACHIEVEMENT
        </div>

        <div
          style={{
            width: 220,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #d4af37, transparent)",
            margin: "18px 0 14px",
          }}
        />

        <div style={{ fontSize: 14, color: "#dedbf4", fontStyle: "italic" }}>
          This is to proudly certify that
        </div>

        <div style={{ marginTop: 10, padding: "0 36px" }}>
          <div
            dir="auto"
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.15,
            }}
          >
            {cert.studentNameEn}
          </div>
          <div
            style={{
              marginTop: 6,
              height: 2,
              width: "100%",
              background: "rgba(212,175,55,0.5)",
            }}
          />
        </div>
        <div
          dir="auto"
          style={{
            marginTop: 8,
            fontSize: 22,
            fontWeight: 700,
            color: "#ffd166",
            fontFamily: "'AmiriCert', Tahoma, Arial, sans-serif",
          }}
        >
          {cert.studentNameAr}
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            color: "#dedbf4",
            lineHeight: 1.6,
            maxWidth: 700,
          }}
        >
          has successfully completed all requirements, practical assessments,
          and masterclass examinations for
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 26,
            fontWeight: 900,
            color: "#41e7ff",
          }}
        >
          {cert.courseTitleEn}
        </div>
        <div
          dir="rtl"
          style={{
            marginTop: 4,
            fontSize: 14,
            fontWeight: 700,
            color: "#b9b6d5",
            fontFamily: "'AmiriCert', Tahoma, Arial, sans-serif",
          }}
        >
          {cert.courseTitleAr}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "#b9b6d5",
            fontFamily: "'Courier New', monospace",
          }}
        >
          CEFR Level: {cert.cefrLevel}
          {cert.finalScorePercentage != null &&
            ` • Final Score: ${cert.finalScorePercentage}%`}
        </div>

        {/* Bottom row: date, seal, signature */}
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: 18,
          }}
        >
          <div style={{ width: 260, textAlign: "left" }}>
            <div
              style={{
                fontSize: 11,
                color: "#b9b6d5",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Date of Issuance
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 16,
                fontWeight: 700,
                color: "#ffffff",
                fontFamily: "'Courier New', monospace",
              }}
            >
              {formatDateEn(cert.issueDate)}
            </div>
          </div>

          {/* Seal */}
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: "50%",
              border: "2px dashed #ffd166",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 24px rgba(255,209,102,0.25)",
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                border: "1px solid rgba(255,209,102,0.6)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <GraduationCap width={22} height={22} color="#ffd166" />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  color: "#ffd166",
                }}
              >
                OFFICIAL SEAL
              </span>
            </div>
          </div>

          <div style={{ width: 260, textAlign: "right" }}>
            <div
              style={{
                fontSize: 26,
                color: "#ffd166",
                fontFamily: "'Segoe Script', 'Brush Script MT', cursive",
                lineHeight: 1,
              }}
            >
              Mr. Hinawi
            </div>
            <div
              style={{
                marginTop: 6,
                height: 1,
                width: "100%",
                background: "rgba(255,255,255,0.4)",
              }}
            />
            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: "#b9b6d5",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Chief Academic Director
            </div>
          </div>
        </div>

        {/* Footer IDs + disclaimer */}
        <div
          style={{
            marginTop: 16,
            width: "100%",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            color: "#ffd166",
          }}
        >
          <span>Certificate No: {cert.certificateId}</span>
          <span>Verification ID: {cert.verificationCode}</span>
        </div>
        <div
          dir="rtl"
          style={{
            marginTop: 6,
            fontSize: 10,
            color: "rgba(185,182,213,0.7)",
            fontFamily: "'AmiriCert', Tahoma, Arial, sans-serif",
          }}
        >
          تنويه: هذه الشهادة توثق الإنجاز الأكاديمي الداخلي لمقررات منصة
          Henglish Academy، ولا تدعي أنها بديل عن اختبارات الهيئات الحكومية أو
          شهادات IELTS/TOEFL الرسمية.
        </div>
      </div>
    </div>
  );
};
