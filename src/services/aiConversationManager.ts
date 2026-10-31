// ==============================================================================
// Henglish Academy (HENGLISH) - CONVERSATION PERSISTENCE & SESSION MANAGER
// Manages distinct multi-turn conversation sessions per AI assistant type
// Persists locally and synchronizes with Supabase database (ai_conversations)
// ==============================================================================

import { AiChatMessage, AiTutorMode } from './aiTutorService';
import { supabase } from './authService';

export interface AiConversationSession {
  id: string;
  userId: string;
  mode: AiTutorMode;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AiChatMessage[];
}

const SESSIONS_STORAGE_KEY = 'henglish_ai_sessions_v1';

function getAllStoredSessions(): Record<string, AiConversationSession> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse stored AI sessions:', err);
  }
  return {};
}

function saveAllStoredSessions(sessions: Record<string, AiConversationSession>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn('Failed to save AI sessions:', err);
  }
}

/**
 * Get all conversation sessions belonging to a specific AI assistant and user
 */
export function getSessionsForAssistant(
  userId: string,
  mode: AiTutorMode
): AiConversationSession[] {
  const all = getAllStoredSessions();
  const sessions = Object.values(all).filter(
    s => s.mode === mode && (s.userId === userId || s.userId === 'guest-learner')
  );

  return sessions.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Create a new conversation session
 */
export function createNewSession(
  userId: string,
  mode: AiTutorMode,
  title?: string,
  initialMessages?: AiChatMessage[]
): AiConversationSession {
  const all = getAllStoredSessions();
  const sessionId = `ses-${mode}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newSession: AiConversationSession = {
    id: sessionId,
    userId: userId || 'guest-learner',
    mode,
    title: title || `محادثة جديدة (${new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })})`,
    createdAt: now,
    updatedAt: now,
    messages: initialMessages || [],
  };

  all[sessionId] = newSession;
  saveAllStoredSessions(all);

  return newSession;
}

/**
 * Save / Update a conversation session
 */
export function updateSession(session: AiConversationSession): void {
  const all = getAllStoredSessions();
  session.updatedAt = new Date().toISOString();

  // Generate smart title from first user message if title is still default
  if (session.messages.length > 0 && session.title.startsWith('محادثة جديدة')) {
    const firstUserMsg = session.messages.find(m => m.sender === 'user');
    if (firstUserMsg) {
      session.title = firstUserMsg.content.slice(0, 32) + (firstUserMsg.content.length > 32 ? '...' : '');
    }
  }

  all[session.id] = session;
  saveAllStoredSessions(all);

  // Sync to Supabase in background if client is connected
  syncSessionToSupabase(session).catch(() => {});
}

/**
 * Rename a conversation session
 */
export function renameSession(sessionId: string, newTitle: string): void {
  const all = getAllStoredSessions();
  if (all[sessionId]) {
    all[sessionId].title = newTitle.trim();
    all[sessionId].updatedAt = new Date().toISOString();
    saveAllStoredSessions(all);
  }
}

/**
 * Delete a conversation session
 */
export function deleteSession(sessionId: string): void {
  const all = getAllStoredSessions();
  if (all[sessionId]) {
    delete all[sessionId];
    saveAllStoredSessions(all);
  }
}

/**
 * Background sync to Supabase `ai_conversations` table
 */
export async function syncSessionToSupabase(session: AiConversationSession): Promise<void> {
  if (!supabase || session.userId === 'guest-learner') return;

  try {
    const lastUserMsg = [...session.messages].reverse().find(m => m.sender === 'user');
    const lastAssistantMsg = [...session.messages].reverse().find(m => m.sender === 'assistant');

    if (lastUserMsg && lastAssistantMsg) {
      await supabase.from('ai_conversations').insert({
        user_id: session.userId,
        mode: session.mode,
        prompt: lastUserMsg.content,
        response: lastAssistantMsg.content,
        corrections_json: lastAssistantMsg.grammarCorrections || null,
        created_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    // Graceful background sync failure
    console.debug('Supabase conversation sync skipped:', err);
  }
}

