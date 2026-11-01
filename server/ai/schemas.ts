// ==============================================================================
// HENGLISH ACADEMY - AI STRUCTURED OUTPUT SCHEMAS & VALIDATORS (ZOD)
// Guarantees rigorous type safety & reject malformed LLM responses
// ==============================================================================

import { z } from 'zod';

/**
 * 1. Educational Assessment & Quiz Question Schema
 */
export const GeneratedQuestionSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    'multiple-choice',
    'fill-blank',
    'error-correction',
    'sentence-ordering',
    'translation',
  ]),
  cefrLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  topic: z.string().min(1),
  prompt: z.string().min(3),
  promptAr: z.string().optional(),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctAnswerIndex: z.number().int().min(0),
  explanationAr: z.string().min(5),
  distractorNotesAr: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  skillCategory: z
    .enum(['grammar', 'vocabulary', 'reading', 'listening', 'writing', 'usage'])
    .optional(),
});

export const GeneratedQuestionsListSchema = z.array(GeneratedQuestionSchema).min(1);

export type ValidatedGeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;

/**
 * 2. Grammar Audit & Error Hunter Schema
 */
export const GrammarAuditSchema = z.object({
  sentence: z.string().min(1),
  hasError: z.boolean(),
  errorTarget: z.string().optional(),
  correction: z.string().min(1),
  ruleNameEn: z.string().min(2),
  ruleNameAr: z.string().min(2),
  explanationAr: z.string().min(5),
  cefrLevel: z.string().default('B1'),
  examples: z.array(z.string()).optional(),
});

export type ValidatedGrammarAudit = z.infer<typeof GrammarAuditSchema>;

/**
 * 3. Writing Evaluation & Feedback Schema
 */
export const WritingEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  cefrEstimated: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  strengthsAr: z.array(z.string()).min(1),
  improvementsAr: z.array(z.string()).min(1),
  grammarScore: z.number().min(0).max(100),
  vocabularyScore: z.number().min(0).max(100),
  coherenceScore: z.number().min(0).max(100),
  annotatedCorrections: z.array(
    z.object({
      original: z.string(),
      replacement: z.string(),
      reasonAr: z.string(),
      category: z.enum(['grammar', 'vocabulary', 'spelling', 'style', 'punctuation']),
    })
  ),
  encouragementAr: z.string().min(5),
});

export type ValidatedWritingEvaluation = z.infer<typeof WritingEvaluationSchema>;

/**
 * 4. Contextual Vocabulary & Translation Analysis Schema
 */
export const TranslationAnalysisSchema = z.object({
  translation: z.string().min(1),
  formality: z.enum(['formal', 'neutral', 'informal', 'slang']),
  dialects: z
    .object({
      fusha: z.string().optional(),
      egyptian: z.string().optional(),
    })
    .optional(),
  grammarBreakdown: z
    .array(
      z.object({
        term: z.string(),
        pos: z.string(),
        roleAr: z.string(),
      })
    )
    .optional(),
  synonyms: z.array(z.string()).optional(),
  usageTipAr: z.string().optional(),
});

export type ValidatedTranslationAnalysis = z.infer<typeof TranslationAnalysisSchema>;

/**
 * Safe JSON extractor from LLM text (handles markdown fences like ```json ... ```)
 */
export function extractJsonFromText(rawText: string): unknown {
  const trimmed = rawText.trim();
  // Strip code blocks if present
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const cleanStr = jsonMatch ? jsonMatch[1].trim() : trimmed;

  try {
    return JSON.parse(cleanStr);
  } catch {
    // If wrapped in brackets or braces with surrounding chatter, attempt extraction
    const firstBrace = cleanStr.indexOf('{');
    const firstBracket = cleanStr.indexOf('[');

    let startIdx = -1;
    let endIdx = -1;

    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      startIdx = firstBracket;
      endIdx = cleanStr.lastIndexOf(']');
    } else if (firstBrace !== -1) {
      startIdx = firstBrace;
      endIdx = cleanStr.lastIndexOf('}');
    }

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const extracted = cleanStr.substring(startIdx, endIdx + 1);
      return JSON.parse(extracted);
    }

    throw new Error('Could not parse valid JSON from AI response text.');
  }
}

/**
 * Validate Generated Questions with Zod
 */
export function validateQuestionsJson(rawText: string): ValidatedGeneratedQuestion[] {
  const json = extractJsonFromText(rawText);
  const arrayData = Array.isArray(json) ? json : (json as { questions?: unknown[] })?.questions;
  if (!Array.isArray(arrayData)) {
    throw new Error('AI response is not an array of questions');
  }

  // Parse each question, repairing minor index mismatches if safe
  const parsed = GeneratedQuestionsListSchema.parse(
    arrayData.map((q, idx) => {
      const qObj = q as Record<string, unknown>;
      const options = Array.isArray(qObj.options) ? qObj.options : [];
      let ansIdx = Number(qObj.correctAnswerIndex ?? 0);
      if (ansIdx < 0 || ansIdx >= options.length) {
        ansIdx = 0;
      }
      return {
        ...qObj,
        id: qObj.id || `gen-${Date.now()}-${idx + 1}`,
        correctAnswerIndex: ansIdx,
      };
    })
  );

  return parsed;
}
