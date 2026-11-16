import { copyText } from '../services/copyText';
import { LessonCorrection } from '../components/LessonCorrection';
// ==============================================================================
// Henglish Academy (HENGLISH) - AI ACADEMY CHAT STUDIO (AiTutorPage)
// 7 Specialized Assistants • Platform-Aware • Streaming • Speech-to-Text • Session History
// ==============================================================================

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { PageRoute, CEFRLevel, UserProfile, UserProgressState } from '../types';
import { 
  AiTutorMode, 
  AiChatMessage, 
  sendAiTutorMessage, 
  ASSISTANTS_REGISTRY 
} from '../services/aiTutorService';
import { 
  getSessionsForAssistant, 
  createNewSession, 
  updateSession, 
  deleteSession, 
  renameSession, 
  AiConversationSession 
} from '../services/aiConversationManager';
import { playSound, speakEnglishVoice, stopSpeech, getVoiceSettings } from '../utils/audio';
import { isAiServiceUnavailable } from '../services/aiAvailability';
import { useLanguage } from '../i18n/LanguageContext';
import { AiMarkdownRenderer } from '../components/AiMarkdownRenderer';
import { ANONYMOUS_AVATAR } from '../services/authService';
import {
  Sparkles,
  Send,
  Volume2,
  Square,
  Bot,
  User,
  GraduationCap,
  MessageSquare,
  BookA,
  PenTool,
  Mic,
  MicOff,
  FileCheck,
  Briefcase,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  History,
  Copy,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface AiTutorPageProps {
  onNavigate: (route: PageRoute) => void;
  userProfile: UserProfile;
  progress?: UserProgressState;
  onOpenVoiceSettings?: () => void;
}

// Icon mapping for 7 assistants
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  MessageSquare,
  BookA,
  PenTool,
  Mic,
  FileCheck,
  Briefcase,
};

export const AiTutorPage: React.FC<AiTutorPageProps> = ({ onNavigate, userProfile, progress, onOpenVoiceSettings }) => {
  const { t } = useLanguage();
  // --- State ---
  const [activeMode, setActiveMode] = useState<AiTutorMode>('grammar-teacher');
  const [sessions, setSessions] = useState<AiConversationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editSessionTitle, setEditSessionTitle] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Active assistant details
  const activeAssistant = ASSISTANTS_REGISTRY[activeMode];
  const ActiveIcon = ICON_MAP[activeAssistant.avatarIcon] || Bot;

  // Active session
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession ? activeSession.messages : [];

  // --- Initialize Sessions when Mode Changes ---
  useEffect(() => {
    const loadedSessions = getSessionsForAssistant(userProfile.id, activeMode);
    if (loadedSessions.length > 0) {
      setSessions(loadedSessions);
      setActiveSessionId(loadedSessions[0].id);
    } else {
      // Create first welcome session for this assistant
      const welcomeMsg: AiChatMessage = {
        id: `welcome-${activeMode}-${Date.now()}`,
        sender: 'assistant',
        content: activeAssistant.welcomeGreetingAr,
        timestamp: new Date().toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
      };

      const newSession = createNewSession(
        userProfile.id,
        activeMode,
        `${activeAssistant.nameAr} - ${t('at.startSession')}`,
        [welcomeMsg]
      );

      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    }
  }, [activeMode, userProfile.id]);

  // Scroll ONLY the inner chat messages container; NEVER scroll the browser window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  // --- Speech-to-Text Setup ---
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputMessage(transcript);
        }
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      recognition.onerror = () => {
        setIsRecordingVoice(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert(t('at.noSpeechApi'));
      return;
    }

    if (isRecordingVoice) {
      recognitionRef.current.stop();
      setIsRecordingVoice(false);
      playSound('click');
    } else {
      playSound('click');
      try {
        recognitionRef.current.start();
        setIsRecordingVoice(true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
        setIsRecordingVoice(false);
      }
    }
  };

  // --- Handlers ---
  const handleStartNewSession = () => {
    playSound('click');
    const welcomeMsg: AiChatMessage = {
      id: `welcome-${activeMode}-${Date.now()}`,
      sender: 'assistant',
      content: `${t('at.welcomePre')} **${activeAssistant.nameAr}**! ${t('at.welcomeAsk')}`,
      timestamp: new Date().toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode,
    };

    const newSession = createNewSession(
      userProfile.id,
      activeMode,
      `${t('at.newSession')} (${new Date().toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' })})`,
      [welcomeMsg]
    );

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    deleteSession(sessionId);

    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);

    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        handleStartNewSession();
      }
    }
  };

  const handleSaveRename = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editSessionTitle.trim()) return;
    playSound('click');
    renameSession(sessionId, editSessionTitle.trim());

    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, title: editSessionTitle.trim() } : s))
    );
    setEditingSessionId(null);
  };

  const handleCopyMessage = async (msgId: string, text: string) => {
    setCopiedMsgId(null);
    setCopyFailed(false);
    if (!(await copyText(text))) { setCopyFailed(true); return; }
    playSound('click');
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    if (isRecordingVoice && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecordingVoice(false);
    }

    playSound('click');

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode,
    };

    // Update active session locally
    const currentMessages = activeSession ? activeSession.messages : [];
    const updatedMessagesWithUser = [...currentMessages, userMsg];

    if (activeSession) {
      const updatedSess = { ...activeSession, messages: updatedMessagesWithUser };
      updateSession(updatedSess);
      setSessions(prev => prev.map(s => (s.id === activeSession.id ? updatedSess : s)));
    }

    setInputMessage('');
    setIsTyping(true);

    // Placeholder message for streaming response
    const assistantMsgId = `ai-${Date.now()}`;
    const streamingAssistantMsg: AiChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode,
      isStreaming: true,
    };

    // Insert streaming placeholder
    const messagesWithStreamingPlaceholder = [...updatedMessagesWithUser, streamingAssistantMsg];
    if (activeSession) {
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSession.id
            ? { ...s, messages: messagesWithStreamingPlaceholder }
            : s
        )
      );
    }

    try {
      let accumulatedStreamingText = '';

      const response = await sendAiTutorMessage({
        message: text.trim(),
        mode: activeMode,
        userLevel: userProfile.currentLevel,
        history: currentMessages,
        platformContext: {
          userProfile,
          progress,
        },
        onChunk: (chunk: string) => {
          accumulatedStreamingText += chunk;
          setSessions(prev =>
            prev.map(s => {
              if (s.id !== activeSessionId) return s;
              const newMsgs = s.messages.map(m =>
                m.id === assistantMsgId
                  ? { ...m, content: accumulatedStreamingText, isStreaming: true }
                  : m
              );
              return { ...s, messages: newMsgs };
            })
          );
        },
      });

      // Finalize assistant message
      const finalAssistantMsg: AiChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        content: response.text || accumulatedStreamingText,
        timestamp: new Date().toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
        isStreaming: false,
        grammarCorrections: response.corrections,
        provider: response.provider,
        model: response.model,
      };

      if (activeSession) {
        const finalSession = {
          ...activeSession,
          messages: [...updatedMessagesWithUser, finalAssistantMsg],
        };
        updateSession(finalSession);
        setSessions(prev => prev.map(s => (s.id === activeSession.id ? finalSession : s)));
      }

      playSound('fanfare');
    } catch (err) {
      const unavailable = isAiServiceUnavailable(err);
      if (!unavailable) {
        console.error('AI chat invocation failed:', err);
      }
      // Graceful error state
      const errMsg: AiChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        content: unavailable ? t('ai.unavailable') : t('at.errorTemp'),
        timestamp: new Date().toLocaleTimeString('ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
        isStreaming: false,
      };

      if (activeSession) {
        const fallbackSession = {
          ...activeSession,
          messages: [...updatedMessagesWithUser, errMsg],
        };
        updateSession(fallbackSession);
        setSessions(prev => prev.map(s => (s.id === activeSession.id ? fallbackSession : s)));
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegenerateLast = () => {
    if (messages.length < 2 || isTyping) return;
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  // --- Render ---
  return (
    <div className="space-y-6 pb-20 text-right max-w-6xl mx-auto px-2 sm:px-4">
      
      {copyFailed && <p role="status" className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-lg rounded-xl border border-amber-300/30 bg-[#171320] p-4 text-sm text-amber-100 shadow-xl">{t('copy.failed')}</p>}

      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-8 bg-linear-to-br from-[#171632] via-[#0c0b20] to-[#1a1438] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30 shadow-sm">
              <Bot className="w-4 h-4" />
              <span>HENGLISH LEARNING ASSISTANT • {t('at.badge')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t('at.heroTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-[#dedbf4] max-w-2xl leading-relaxed">
              {Object.keys(ASSISTANTS_REGISTRY).length} {t('at.heroBody')}
            </p>
          </div>

          {/* Student Meta Card */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl shrink-0">
            <img
              src={userProfile.avatar || ANONYMOUS_AVATAR}
              alt={userProfile.name}
              onError={(e) => {
                if (e.currentTarget.src !== ANONYMOUS_AVATAR) {
                  e.currentTarget.src = ANONYMOUS_AVATAR;
                }
              }}
              className="w-11 h-11 rounded-xl object-cover border-2 border-[#ffd166]/50 shadow-md"
            />
            <div className="text-right">
              <div className="text-xs font-black text-white">{userProfile.nameAr}</div>
              <div className="flex items-center gap-2 text-[11px] text-[#b9b6d5] mt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-[#41e7ff]/20 text-[#41e7ff] font-bold">
                  {t('at.level')}: {userProfile.currentLevel}
                </span>
                <span className="flex items-center gap-1 text-[#ffd166] font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {userProfile.streakDays} {t('at.days')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 7 Specialized Assistant Selector Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#b9b6d5] px-1">
          <span className="flex items-center gap-1.5 text-white">
            <Sparkles className="w-4 h-4 text-[#ffd166]" />
            {t('at.chooseTutor')}
          </span>
          <span className="text-[#ffd166] text-[11px] hidden sm:inline">
            {Object.keys(ASSISTANTS_REGISTRY).length} {t('at.modes')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {Object.values(ASSISTANTS_REGISTRY).map(asst => {
            const Icon = ICON_MAP[asst.avatarIcon] || Bot;
            const isActive = activeMode === asst.id;

            return (
              <button
                key={asst.id}
                onClick={() => {
                  if (activeMode !== asst.id) {
                    playSound('click');
                    stopSpeech();
                    setActiveMode(asst.id);
                  }
                }}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden group ${
                  isActive
                    ? 'bg-linear-to-b from-[#ffd166]/20 via-[#171632] to-[#41e7ff]/20 border-[#ffd166] shadow-xl ring-2 ring-[#ffd166]/30 scale-[1.02]'
                    : 'glass-panel border-white/10 hover:border-white/20 hover:bg-white/5 text-[#b9b6d5] hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#ffd166]/20 rounded-full blur-xl pointer-events-none" />
                )}

                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'bg-linear-to-br from-[#ffd166] to-[#ff9c66] text-[#0c0b20] shadow-md'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#ffd166] animate-pulse" />
                  )}
                </div>

                <div>
                  <div className="text-xs font-black text-white leading-tight">
                    {t(`atm.${asst.id}.name`)}
                  </div>
                  <div className="text-[10px] text-[#b9b6d5] font-mono mt-0.5 truncate">
                    {asst.nameEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Active Mode Meta Banner */}
      <section className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-[#dedbf4]">
          <div className="w-7 h-7 rounded-lg bg-[#41e7ff]/20 text-[#41e7ff] flex items-center justify-center shrink-0">
            <ActiveIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white me-1.5">{t(`atm.${activeMode}.name`)}:</span>
            <span>{t(`atm.${activeMode}.description`)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
          {onOpenVoiceSettings && (
            <button
              onClick={() => {
                playSound('click');
                onOpenVoiceSettings();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ffd166]/20 to-[#41e7ff]/20 hover:brightness-125 border border-[#ffd166]/40 text-[11px] font-bold text-[#ffd166] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title={t('at.voiceTitle')}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#ffd166]" />
              <span>{t('at.changeVoice')} <bdi dir="auto">({getVoiceSettings().selectedVoiceName || t('at.defaultVoice')})</bdi></span>
            </button>
          )}

          <button
            onClick={() => setIsHistoryDrawerOpen(!isHistoryDrawerOpen)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
            title={t('at.historyTitle')}
          >
            <History className="w-3.5 h-3.5 text-[#41e7ff]" />
            <span>{t('at.sessions')} <bdi dir="ltr" className="whitespace-nowrap">({sessions.length})</bdi></span>
          </button>

          <button
            onClick={handleStartNewSession}
            className="px-3 py-1.5 rounded-xl bg-[#ffd166]/20 hover:bg-[#ffd166]/30 border border-[#ffd166]/40 text-[11px] font-bold text-[#ffd166] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title={t('at.newSessionTitle')}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('at.newSession')}</span>
          </button>
        </div>
      </section>

      {/* 4. History Sessions Panel (Collapsible Drawer) */}
      <AnimatePresence>
        {isHistoryDrawerOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel rounded-2xl border border-white/15 p-4 space-y-3 bg-[#0d0c24]">
              <div className="flex items-center justify-between text-xs font-bold text-white pb-2 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#41e7ff]" />
                  {t('at.historyWith')}: {t(`atm.${activeMode}.name`)}
                </span>
                <span className="text-[10px] text-[#b9b6d5]">
                  {t('at.autoSave')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                {sessions.map(s => {
                  const isCurrent = s.id === activeSessionId;
                  const isEditing = editingSessionId === s.id;

                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        if (!isEditing) {
                          playSound('click');
                          setActiveSessionId(s.id);
                        }
                      }}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isCurrent
                          ? 'bg-linear-to-r from-[#ffd166]/20 to-[#41e7ff]/20 border-[#ffd166] text-white shadow-md'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-[#dedbf4]'
                      }`}
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 w-full" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editSessionTitle}
                            onChange={e => setEditSessionTitle(e.target.value)}
                            className="flex-1 bg-black/60 border border-[#ffd166] rounded-lg px-2 py-1 text-xs text-white"
                            autoFocus
                          />
                          <button
                            onClick={e => handleSaveRename(s.id, e)}
                            className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setEditingSessionId(null);
                            }}
                            className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 truncate">
                            <div className="text-xs font-bold truncate">{s.title}</div>
                            <div className="text-[10px] text-[#b9b6d5] mt-0.5">
                              {s.messages.length} {t('at.messages')} • {new Date(s.updatedAt).toLocaleDateString('ar-EG-u-nu-latn')}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setEditingSessionId(s.id);
                                setEditSessionTitle(s.title);
                              }}
                              className="p-1 hover:text-[#ffd166] text-[#b9b6d5] transition-colors"
                              title={t('at.renameTitle')}
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={e => handleDeleteSession(s.id, e)}
                              className="p-1 hover:text-red-400 text-[#b9b6d5] transition-colors"
                              title={t('at.deleteTitle')}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 5. Main Chat Studio Container */}
      <section className="glass-panel rounded-3xl border border-white/15 overflow-hidden flex flex-col h-[600px] shadow-2xl relative bg-[#0a091d]/90">
        
        {/* Messages Stream */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';

            return (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                {isUser ? (
                  <img
                    src={userProfile.avatar || ANONYMOUS_AVATAR}
                    alt={userProfile.name}
                    onError={(e) => {
                      if (e.currentTarget.src !== ANONYMOUS_AVATAR) {
                        e.currentTarget.src = ANONYMOUS_AVATAR;
                      }
                    }}
                    className="w-9 h-9 rounded-xl object-cover border border-[#41e7ff]/40 shrink-0 mt-1 shadow-md"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#ffd166] to-[#ff9c66] flex items-center justify-center font-black text-[#0c0b20] text-sm shrink-0 mt-1 shadow-md">
                    <ActiveIcon className="w-5 h-5" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[92%] sm:max-w-[80%] p-4 sm:p-5 rounded-2xl space-y-3 ${
                    isUser
                      ? 'bg-linear-to-r from-[#41e7ff]/20 to-[#ffd166]/10 border border-[#41e7ff]/30 text-white rounded-tr-none'
                      : 'bg-[#151430] border border-white/15 text-white rounded-tl-none shadow-xl'
                  }`}
                >
                  {/* Bubble Header */}
                  <div className="flex items-center justify-between gap-3 text-[10px] text-[#b9b6d5] pb-2 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">
                        {isUser ? userProfile.nameAr : t(`atm.${activeMode}.name`)}
                      </span>
                      {!isUser && msg.provider && (
                        <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] text-[#41e7ff] font-mono">
                          {msg.provider}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>

                      {/* Copy message */}
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="p-1 rounded hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer"
                        title={t('at.copyTitle')}
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Audio listen button */}
                      {!isUser && (
                        <button
                          onClick={() => {
                            playSound('click');
                            speakEnglishVoice(msg.content);
                          }}
                          className="p-1 rounded hover:bg-white/10 text-[#ffd166] cursor-pointer transition-colors"
                          title={t('at.listenFullTitle')}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message Body with Safe Markdown & LTR Isolation */}
                  <div className="text-xs sm:text-sm font-sans leading-relaxed">
                    <AiMarkdownRenderer content={msg.content} onNavigate={onNavigate} />
                    {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-[#ffd166] ml-1 animate-pulse align-middle" />
                    )}
                  </div>

                  {/* Grammar Corrections Card if provided */}
                  {msg.grammarCorrections && msg.grammarCorrections.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2 mt-2">
                      <span className="text-xs font-black text-red-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        {t('at.corrections')}
                      </span>
                      {msg.grammarCorrections.map((corr, cIdx) => (
                        <div key={cIdx} className="text-xs space-y-0.5 bg-black/30 p-2.5 rounded-lg border border-red-500/20">
                          <LessonCorrection wrong={corr.wrong} correct={corr.correct} />
                          <div className="text-[#dedbf4] text-[11px] pt-1">
                           {corr.explanationAr}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#ffd166] to-[#ff9c66] flex items-center justify-center font-black text-[#0c0b20] text-sm shrink-0">
                <ActiveIcon className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-[#151430] border border-white/15 flex items-center gap-2.5 shadow-lg">
                <span className="text-xs text-[#ffd166] font-bold">
                  {t(`atm.${activeMode}.name`)} {t('at.preparing')}
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd166] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#41e7ff] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff4f9a] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Quick Suggestions Bar */}
        <div className="p-2 sm:p-3 bg-black/50 border-t border-white/10 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] font-bold text-[#b9b6d5] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#ffd166]" />
            {t('at.suggestions')}
          </span>
          {activeAssistant.suggestedQuestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug.promptText)}
              className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-[#ffd166] hover:text-white transition-all cursor-pointer shrink-0 truncate max-w-sm hover:scale-[1.02]"
              title={sug.promptText}
            >
              {sug.labelAr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0a091d] border-t border-white/15 flex items-center gap-2">
          
          {/* Speech-to-Text Mic Button */}
          <button
            onClick={toggleVoiceRecording}
            className={`p-3 rounded-2xl border transition-all cursor-pointer shrink-0 ${
              isRecordingVoice
                ? 'bg-red-500 text-white border-red-400 animate-pulse ring-4 ring-red-500/30'
                : 'bg-white/5 border-white/15 text-[#b9b6d5] hover:text-[#ffd166] hover:bg-white/10'
            }`}
            title={isRecordingVoice ? t('at.stopRecording') : t('at.startRecording')}
            aria-label={t('at.recordAria')}
          >
            {isRecordingVoice ? (
              <MicOff className="w-5 h-5 text-white animate-bounce" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            dir="auto"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isRecordingVoice
                ? t('at.listening')
                : `${t('at.askPre')} ${t(`atm.${activeMode}.name`)}...`
            }
            className="flex-1 min-w-0 px-4 py-3 rounded-2xl bg-[#151430] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ffd166] transition-colors"
          />

          {/* Regenerate Button if messages exist */}
          {messages.length > 1 && !isTyping && (
            <button
              onClick={handleRegenerateLast}
              className="p-3 rounded-2xl bg-white/5 border border-white/15 text-[#b9b6d5] hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0 hidden sm:flex"
              title={t('at.regenerate')}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer shrink-0 shadow-lg"
            aria-label={t('at.sendAria')}
          >
            <Send className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </section>

    </div>
  );
};
