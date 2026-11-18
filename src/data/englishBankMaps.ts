import idioms from '../../public/data/idioms/i18n/en.json';
import slang from '../../public/data/slang/i18n/en.json';
import genz from '../../public/data/genz/i18n/en.json';
import ielts from '../../public/data/ielts/vocab/i18n/en.json';
import toefl from '../../public/data/toefl/vocab/i18n/en.json';
import vocab from '../../public/data/vocab/i18n/en.json';
export const ENGLISH_BANK_MAPS: Record<string, Record<string, {m: string; e?: string}>> = {
  vocab, idioms, slang, genz, 'ielts/vocab': ielts, 'toefl/vocab': toefl,
};
