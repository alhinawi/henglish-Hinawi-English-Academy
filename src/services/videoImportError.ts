import { videoVerificationDetail } from './videoVerificationDetail';

// Translate only at display time. Saved video records and provider text stay intact.
export function videoImportError(error: string | undefined, t: (key: string) => string): string {
  if (!error) return '';
  if (error === 'vie.unverified' || error === 'vi.importError') return t(error);
  const keys: Record<string, string> = {
    'رابط يوتيوب غير صالح أو غير معتمد (Invalid YouTube URL)': 'vie.invalid',
    'الفيديو محذوف أو خاص على يوتيوب ولا يمكن استيراده': 'vie.missing',
    'صاحب الفيديو عطل التضمين الخارجي (Embedding Disabled by Owner)': 'vie.restricted',
    'معرف يوتيوب غير صالح': 'vie.invalid',
  };
  if (keys[error]) return t(keys[error]);
  const replacement = error.match(/^الفيديو الجديد غير متاح للتضمين: (.*)$/);
  if (replacement) return t('vie.replacement').replace('{detail}', videoVerificationDetail(replacement[1], t));
  return error;
}
