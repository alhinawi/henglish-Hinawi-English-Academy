// ==============================================================================
// HENGLISH ACADEMY - RESPONSIVE TRANSACTIONAL EMAIL TEMPLATES
// Premium branded HTML and plain-text templates with bidirectional support
// ==============================================================================

/**
 * Escapes HTML characters to prevent XSS in email clients
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface EmailRenderOutput {
  subject: string;
  html: string;
  text: string;
}

// Reusable email layout wrapper
function wrapBaseTemplate(options: {
  title: string;
  preheader: string;
  bodyContent: string;
}): string {
  const { title, preheader, bodyContent } = options;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #09091a;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #dedbf4;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #121124;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #171632 0%, #211b47 50%, #121124 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .header-logo {
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .header-tagline {
      font-size: 12px;
      font-weight: 700;
      color: #41e7ff;
      margin-top: 6px;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px 24px;
      line-height: 1.7;
    }
    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, #41e7ff 0%, #9b7bff 100%);
      color: #0c0b20 !important;
      font-weight: 900;
      font-size: 15px;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 14px;
      text-align: center;
      margin: 20px 0;
      box-shadow: 0 4px 15px rgba(65, 231, 255, 0.3);
    }
    .info-card {
      background-color: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 18px;
      margin: 20px 0;
    }
    .footer {
      padding: 24px;
      text-align: center;
      font-size: 11px;
      color: #8c89a8;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background-color: #0d0c1b;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      background-color: rgba(255, 209, 102, 0.15);
      color: #ffd166;
      border: 1px solid rgba(255, 209, 102, 0.3);
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 8px; background-color: #09091a;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center">
        <div class="email-container">
          
          <!-- Header -->
          <div class="header">
            <h1 class="header-logo">
              <span style="color: #41e7ff;">H</span>ENGLISH ACADEMY
            </h1>
            <div class="header-tagline">أكاديمية هناوي للغة الإنجليزية التفاعلية</div>
          </div>

          <!-- Main Content -->
          <div class="content" dir="rtl" style="text-align: right;">
            ${bodyContent}
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="margin: 0 0 8px 0; color: #b9b6d5;">
              © ${new Date().getFullYear()} Henglish Academy. جميع الحقوق محفوظة.
            </p>
            <p style="margin: 0; font-size: 10px; color: #6b6889;">
              هذه رسالة آلية صادرة عن نظام الحماية والأمان في Henglish Academy عبر Brevo SMTP.<br>
              إذا لم تكن أنت صاحب هذا الحساب، يرجى تجاهل هذه الرسالة والتواصل مع الدعم الفني.
            </p>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ==============================================================================
// 1. WELCOME EMAIL TEMPLATE
// ==============================================================================

export interface WelcomeEmailParams {
  name: string;
  email: string;
  loginUrl?: string;
}

export function renderWelcomeEmail(params: WelcomeEmailParams): EmailRenderOutput {
  const safeName = escapeHtml(params.name || 'عزيزنا الطالب');
  const safeLoginUrl = escapeHtml(params.loginUrl || 'https://henglish.academy/#login');

  const subject = `مرحباً بك في أكاديمية هناوي للغة الإنجليزية! 🌟 Welcome to Henglish`;
  const preheader = `ابدأ رحلتك لإتقان الإنجليزية مع 55,000 كلمة و GameVerse التفاعلية.`;

  const bodyContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">🎉 حساب تعليمي جديد</span>
      <h2 style="color: #ffffff; font-size: 24px; margin: 12px 0 6px 0;">أهلاً بك يا ${safeName}!</h2>
      <p style="color: #b9b6d5; font-size: 14px; margin: 0;">يسعدنا انضمامك إلى كبرى منصات تعليم الإنجليزية التفاعلية المعتمدة على الذكاء الاصطناعي والألعاب اللغوية.</p>
    </div>

    <div class="info-card">
      <h3 style="color: #41e7ff; font-size: 15px; margin: 0 0 10px 0;">ما الذي ينتظرك داخل المنصة؟</h3>
      <ul style="margin: 0; padding-right: 20px; color: #dedbf4; font-size: 13px;">
        <li style="margin-bottom: 8px;"><strong>Henglish GameVerse:</strong> 32 لعبة تفاعلية حقيقية لتنمية المفردات والقواعد والتهجئة والاستماع.</li>
        <li style="margin-bottom: 8px;"><strong>المعجم الذكي:</strong> أكثر من 55,000 كلمة و 10,000 تعبير بلهجتين (أمريكية وبريطانية).</li>
        <li style="margin-bottom: 8px;"><strong>المعلم الذكي AI Tutor:</strong> محادثات واقعية وتصحيح لحظي للأخطاء.</li>
        <li><strong>نظام التكرار المتباعد SRS:</strong> حفظ دائم في الذاكرة طويلة المدى.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${safeLoginUrl}" class="btn-primary" target="_blank">
        ابدأ رحلة التعلم الآن 🚀
      </a>
    </div>

    <p style="font-size: 12px; color: #8c89a8; text-align: center; margin: 0;">
      إذا واجهت أي استفسار، فريق الدعم الفني والأكاديمي دائماً في خدمتك.
    </p>
  `;

  const text = `
مرحباً بك في أكاديمية هناوي للغة الإنجليزية يا ${params.name}!

يسعدنا انضمامك إلى Henglish Academy. لقد تم إنشاء حسابك بنجاح.
يمكنك الآن تسجيل الدخول وبدء تدريبات GameVerse والمعجم التفاعلي عبر الرابط:
${params.loginUrl || 'https://henglish.academy/#login'}

مع أطيب التمنيات،
فريق أكاديمية هناوي
`;

  return {
    subject,
    html: wrapBaseTemplate({ title: subject, preheader, bodyContent }),
    text: text.trim(),
  };
}

// ==============================================================================
// 2. ACCOUNT VERIFICATION GUIDANCE EMAIL
// ==============================================================================

export interface VerificationGuidanceEmailParams {
  name: string;
  email: string;
  verificationOtp?: string;
  verificationUrl?: string;
}

export function renderVerificationGuidanceEmail(params: VerificationGuidanceEmailParams): EmailRenderOutput {
  const safeName = escapeHtml(params.name || 'عزيزنا المستخدم');
  const safeOtp = params.verificationOtp ? escapeHtml(params.verificationOtp) : null;
  const safeUrl = params.verificationUrl ? escapeHtml(params.verificationUrl) : null;

  const subject = `رمز التحقق من البريد الإلكتروني - Henglish Academy`;
  const preheader = `استخدم الرمز لتأكيد ملكية حسابك في أكاديمية هناوي.`;

  const bodyContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">🔐 تأكيد ملكية البريد الإلكتروني</span>
      <h2 style="color: #ffffff; font-size: 22px; margin: 12px 0 6px 0;">تأكيد حسابك يا ${safeName}</h2>
      <p style="color: #b9b6d5; font-size: 13px; margin: 0;">يرجى تأكيد بريدك الإلكتروني لتفعيل كامل ميزات الحفظ السحابي وإصدار الشهادات.</p>
    </div>

    ${safeOtp ? `
    <div style="text-align: center; margin: 24px 0;">
      <div style="display: inline-block; background-color: #09091a; border: 2px solid #41e7ff; border-radius: 16px; padding: 16px 36px;">
        <span style="font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #ffd166;">
          ${safeOtp}
        </span>
      </div>
      <p style="font-size: 11px; color: #8c89a8; margin-top: 8px;">هذا الرمز صالح لمدة 60 دقيقة فقط.</p>
    </div>
    ` : ''}

    ${safeUrl ? `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${safeUrl}" class="btn-primary" target="_blank">
        تأكيد البريد الإلكتروني بنقرة واحدة ✓
      </a>
    </div>
    ` : ''}

    <div class="info-card">
      <p style="margin: 0; font-size: 12px; color: #b9b6d5; text-align: center;">
        إذا لم تقم بإنشاء حساب في Henglish Academy، يمكنك تجاهل هذا البريد تماماً دون أي قلق.
      </p>
    </div>
  `;

  const text = `
تأكيد حسابك في أكاديمية هناوي:

يا ${params.name}،
${params.verificationOtp ? `رمز التحقق الخاص بك هو: ${params.verificationOtp}` : ''}
${params.verificationUrl ? `أو اضغط على الرابط التالي لتأكيد بريدك: ${params.verificationUrl}` : ''}

صالح لمدة 60 دقيقة. إذا لم تقم بطلب هذا الرمز، يرجى تجاهل الرسالة.
`;

  return {
    subject,
    html: wrapBaseTemplate({ title: subject, preheader, bodyContent }),
    text: text.trim(),
  };
}

// ==============================================================================
// 3. PASSWORD RESET GUIDANCE EMAIL
// ==============================================================================

export interface PasswordResetGuidanceParams {
  name: string;
  email: string;
  resetUrl: string;
}

export function renderPasswordResetGuidanceEmail(params: PasswordResetGuidanceParams): EmailRenderOutput {
  const safeName = escapeHtml(params.name || 'عزيزنا المستخدم');
  const safeUrl = escapeHtml(params.resetUrl);

  const subject = `إعادة تعيين كلمة المرور - Henglish Academy`;
  const preheader = `طلب استعادة كلمة المرور لحسابك في أكاديمية هناوي.`;

  const bodyContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge" style="background-color: rgba(255, 79, 154, 0.15); color: #ff4f9a; border-color: rgba(255, 79, 154, 0.3);">
        🔑 استعادة كلمة المرور
      </span>
      <h2 style="color: #ffffff; font-size: 22px; margin: 12px 0 6px 0;">مرحباً يا ${safeName}</h2>
      <p style="color: #b9b6d5; font-size: 13px; margin: 0;">تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في المنصة.</p>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${safeUrl}" class="btn-primary" target="_blank">
        تعيين كلمة مرور جديدة 🔒
      </a>
    </div>

    <div class="info-card">
      <p style="margin: 0; font-size: 12px; color: #b9b6d5; line-height: 1.6;">
        ⚠️ <strong>ملاحظة أمنية هامة:</strong><br>
        هذا الرابط مخصص للاستخدام مرة واحدة وصالح لمدة ساعتين فقط.<br>
        إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة، فكلمة مرورك الحالية آمنة تماماً.
      </p>
    </div>
  `;

  const text = `
طلب إعادة تعيين كلمة المرور - Henglish Academy:

مرحباً يا ${params.name}،
تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك (${params.email}).
اضغط على الرابط التالي لإنشاء كلمة مرور جديدة:
${params.resetUrl}

الرابط صالح لمدة ساعتين. إذا لم تكن أنت من طلب ذلك، يرجى تجاهل هذه الرسالة.
`;

  return {
    subject,
    html: wrapBaseTemplate({ title: subject, preheader, bodyContent }),
    text: text.trim(),
  };
}

// ==============================================================================
// 4. PASSWORD CHANGED NOTIFICATION EMAIL
// ==============================================================================

export interface PasswordChangedEmailParams {
  name: string;
  email: string;
  changeTime?: string;
  ipAddress?: string;
  userAgent?: string;
}

export function renderPasswordChangedEmail(params: PasswordChangedEmailParams): EmailRenderOutput {
  const safeName = escapeHtml(params.name || 'عزيزنا المستخدم');
  const time = escapeHtml(params.changeTime || new Date().toUTCString());
  const ip = escapeHtml(params.ipAddress || 'غير محدد');

  const subject = `تنبيه أمني: تم تغيير كلمة المرور لحسابك في Henglish Academy`;
  const preheader = `إشعار رسمي بتحديث كلمة المرور الخاصة بحسابك.`;

  const bodyContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge" style="background-color: rgba(196, 255, 85, 0.15); color: #c4ff55; border-color: rgba(196, 255, 85, 0.3);">
        🛡️ إشعار أمني مؤكد
      </span>
      <h2 style="color: #ffffff; font-size: 22px; margin: 12px 0 6px 0;">تم تحديث كلمة المرور بنجاح</h2>
      <p style="color: #b9b6d5; font-size: 13px; margin: 0;">مرحباً يا ${safeName}، نود إعلامك بأنه تم تغيير كلمة المرور لحسابك بنجاح.</p>
    </div>

    <div class="info-card">
      <table width="100%" cellspacing="0" cellpadding="4" style="font-size: 12px; color: #dedbf4;">
        <tr>
          <td style="color: #8c89a8;">وقت التعديل:</td>
          <td dir="ltr" style="font-weight: bold; text-align: left;">${time}</td>
        </tr>
        <tr>
          <td style="color: #8c89a8;">عنوان IP:</td>
          <td dir="ltr" style="font-weight: bold; text-align: left;">${ip}</td>
        </tr>
      </table>
    </div>

    <div class="info-card" style="border-color: rgba(255, 79, 154, 0.3); background-color: rgba(255, 79, 154, 0.05);">
      <p style="margin: 0; font-size: 12px; color: #ff9cc8; line-height: 1.6;">
        🚨 <strong>لم تقم بهذا الإجراء؟</strong><br>
        إذا لم تكن أنت من قام بتغيير كلمة المرور، يرجى استعادة حسابك فوراً أو التواصل مع إدارة المنصة لتأمين بياناتك.
      </p>
    </div>
  `;

  const text = `
تنبيه أمني - Henglish Academy:
مرحباً يا ${params.name}،
تم تغيير كلمة المرور لحسابك بنجاح في: ${params.changeTime || new Date().toUTCString()} (IP: ${params.ipAddress || 'Unknown'}).
إذا لم تكن أنت صاحب هذا التعديل، يرجى استعادة حسابك فوراً عبر الموقع.
`;

  return {
    subject,
    html: wrapBaseTemplate({ title: subject, preheader, bodyContent }),
    text: text.trim(),
  };
}

// ==============================================================================
// 5. IMPORTANT ACCOUNT NOTIFICATION EMAIL
// ==============================================================================

export interface AccountNotificationParams {
  name: string;
  email: string;
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  badge?: string;
}

export function renderAccountNotificationEmail(params: AccountNotificationParams): EmailRenderOutput {
  const safeName = escapeHtml(params.name || 'عزيزنا المستخدم');
  const safeTitle = escapeHtml(params.title);
  const safeMessage = escapeHtml(params.message).replace(/\n/g, '<br>');
  const safeActionText = params.actionText ? escapeHtml(params.actionText) : null;
  const safeActionUrl = params.actionUrl ? escapeHtml(params.actionUrl) : null;
  const safeBadge = escapeHtml(params.badge || 'إشعار أكاديمي');

  const subject = `${params.title} - Henglish Academy`;
  const preheader = params.message.slice(0, 100);

  const bodyContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">${safeBadge}</span>
      <h2 style="color: #ffffff; font-size: 22px; margin: 12px 0 6px 0;">${safeTitle}</h2>
      <p style="color: #ffd166; font-size: 13px; font-weight: bold; margin: 0;">عزيزنا الطالب ${safeName}</p>
    </div>

    <div class="info-card">
      <div style="font-size: 14px; line-height: 1.8; color: #dedbf4;">
        ${safeMessage}
      </div>
    </div>

    ${safeActionText && safeActionUrl ? `
    <div style="text-align: center; margin: 28px 0;">
      <a href="${safeActionUrl}" class="btn-primary" target="_blank">
        ${safeActionText}
      </a>
    </div>
    ` : ''}
  `;

  const text = `
${params.title} - Henglish Academy
مرحباً يا ${params.name}،

${params.message}

${params.actionUrl ? `${params.actionText || 'الرابط'}: ${params.actionUrl}` : ''}

أكاديمية هناوي للغة الإنجليزية
`;

  return {
    subject,
    html: wrapBaseTemplate({ title: subject, preheader, bodyContent }),
    text: text.trim(),
  };
}

// ==============================================================================
// 6. ADMINISTRATIVE TEST EMAIL
// ==============================================================================

export interface AdminTestEmailParams {
  timestamp: string;
  host: string;
  user: string;
  environment: string;
}

export function renderAdminTestEmail(params: AdminTestEmailParams): EmailRenderOutput {
  const subject = `[SMTP TEST SUCCESSFUL] Brevo SMTP Verification - Henglish Academy`;
  const preheader = `تم التحقق بنجاح من اتصال وخادم البريد Brevo SMTP في بيئة ${params.environment}.`;

  const bodyContent = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge" style="background-color: rgba(65, 231, 255, 0.15); color: #41e7ff; border-color: rgba(65, 231, 255, 0.3);">
        ⚡ Brevo SMTP Test Verification
      </span>
      <h2 style="color: #ffffff; font-size: 22px; margin: 12px 0 6px 0;">اتصال خادم البريد يعمل بنجاح!</h2>
      <p style="color: #c4ff55; font-size: 13px; font-weight: bold; margin: 0;">All Systems Operational • Brevo Relay Connected</p>
    </div>

    <div class="info-card">
      <h3 style="color: #ffd166; font-size: 14px; margin: 0 0 12px 0;">بيانات الاختبار التشغيلي:</h3>
      <table width="100%" cellspacing="0" cellpadding="4" style="font-size: 12px; color: #dedbf4; font-family: monospace;">
        <tr>
          <td style="color: #8c89a8;">SMTP Host:</td>
          <td dir="ltr" style="text-align: left;">${escapeHtml(params.host)}:587 (STARTTLS)</td>
        </tr>
        <tr>
          <td style="color: #8c89a8;">SMTP User:</td>
          <td dir="ltr" style="text-align: left;">${escapeHtml(params.user)}</td>
        </tr>
        <tr>
          <td style="color: #8c89a8;">Environment:</td>
          <td dir="ltr" style="text-align: left;">${escapeHtml(params.environment)}</td>
        </tr>
        <tr>
          <td style="color: #8c89a8;">Timestamp:</td>
          <td dir="ltr" style="text-align: left;">${escapeHtml(params.timestamp)}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 12px; color: #b9b6d5; text-align: center; margin: 16px 0 0 0;">
      هذا البريد تم إرساله للتأكد من جاهزية خادم Brevo SMTP لإرسال الرسائل الحية بنجاح إلى منصة Henglish Academy.
    </p>
  `;

  const text = `
[SMTP TEST SUCCESSFUL] Brevo SMTP Verification - Henglish Academy
Timestamp: ${params.timestamp}
Host: ${params.host}:587 (STARTTLS)
User: ${params.user}
Environment: ${params.environment}

All systems operational.
`;

  return {
    subject,
    html: wrapBaseTemplate({ title: subject, preheader, bodyContent }),
    text: text.trim(),
  };
}

