// Display-only adapter. Do not change or migrate stored verification records.
export function videoVerificationDetail(details: string | undefined, t: (key: string) => string): string {
  if (!details) return '';
  if (details === "معرّف يوتيوب غير صالح (Invalid YouTube ID format)") return t('vd.invalid');
  if (details === "الفيديو معتمد ومتاح للتشغيل والتضمين بالكامل") return t('vd.metadata');
  if (details === "الفيديو موجود لكن صاحب المحتوى عطل التضمين الخارجي (Embedding Restricted)") return t('vd.restricted');
  if (details === "الفيديو محذوف أو خاص أو غير متاح على يوتيوب (HTTP 404)") return t('vd.missing');
  if (details === "Thumbnail found. Playback and embedding could not be verified.") return t('vd.thumbnail');
  if (details === 'تم التحقق من وجود الفيديو عبر المعاينة الصورية الرسمية (Thumbnail verified)') return t('vd.thumbnail');
  const response = details.match(/^استجابة غير متوقعة من خوادم يوتيوب \(HTTP (\d+)\)$/);
  if (response) return t('vd.response').replace('{status}', response[1]);
  const network = details.match(/^تعذر الاتصال بفاحص يوتيوب: (.*)$/);
  if (network) return t('vd.network').replace('{message}', network[1]);
  return details;
}
