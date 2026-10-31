// ==============================================================================
// Henglish Academy (HENGLISH) - ADVANCED VOICE STUDIO MODAL
// Multi-Voice Selector (Female & Male), Accent Filter, Instant Preview & ElevenLabs Integration
// ==============================================================================

import React, { useState, useEffect } from "react";
import {
  getVoiceSettings,
  setVoiceGender,
  setVoiceAccent,
  setVoiceSpeed,
  setVoiceId,
  toggleAudioMute,
  speakEnglishVoice,
  stopSpeech,
  VoiceGender,
  VoiceAccent,
  SpeechSpeed,
} from "../utils/audio";
import { VOICES_CATALOG, VoiceItem } from "../data/voicesCatalog";
import {
  Volume2,
  VolumeX,
  X,
  Play,
  Square,
  Sparkles,
  Check,
  Mic,
  Gauge,
  Globe,
  Radio,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterCategory = "all" | "female" | "male" | "US" | "UK";

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState(getVoiceSettings());
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getVoiceSettings());
    }
  }, [isOpen]);

  const handleSelectVoice = (voice: VoiceItem) => {
    const accent: VoiceAccent = voice.accent === "UK" ? "UK" : "US";
    setVoiceId(voice.id, voice.name, voice.gender, accent);
    setSettings(prev => ({
      ...prev,
      selectedVoiceId: voice.id,
      selectedVoiceName: voice.name,
      gender: voice.gender,
      accent,
    }));
  };

  const handlePlayVoicePreview = (voice: VoiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingVoiceId === voice.id) {
      stopSpeech();
      setPlayingVoiceId(null);
      return;
    }

    setPlayingVoiceId(voice.id);
    speakEnglishVoice(voice.samplePhrase, {
      voiceId: voice.id,
      gender: voice.gender,
      accent: voice.accent === "AU" ? "US" : voice.accent,
      speed: settings.speed,
      onEnd: () => setPlayingVoiceId(null),
      onError: () => setPlayingVoiceId(null),
    });
  };

  const handleSpeedChange = (speed: SpeechSpeed) => {
    setVoiceSpeed(speed);
    setSettings((prev) => ({ ...prev, speed }));
  };

  const handleToggleMute = () => {
    const isMuted = toggleAudioMute();
    setSettings((prev) => ({ ...prev, isMuted }));
  };

  // Filtered voice items
  const filteredVoices = VOICES_CATALOG.filter(v => {
    if (filter === "female") return v.gender === "female";
    if (filter === "male") return v.gender === "male";
    if (filter === "US") return v.accent === "US";
    if (filter === "UK") return v.accent === "UK";
    return true;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#14132b] border border-white/20 p-5 sm:p-7 shadow-2xl text-right z-10 space-y-5 max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#b9b6d5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ffd166]/20 to-[#41e7ff]/20 border border-[#ffd166]/40 flex items-center justify-center text-[#ffd166] shadow-md">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  استوديو الأصوات الطبيعية (ElevenLabs AI Studio) 🎙️
                </h3>
                <p className="text-xs text-[#dedbf4]">
                  اختر من بين تشكيلة أصوات حريمي ورجالي طبيعية باللكنتين الأمريكية والبريطانية
                </p>
              </div>
            </div>
          </div>

          {/* Filter Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 custom-scrollbar">
            {[
              { id: "all" as FilterCategory, label: `جميع الأصوات (${VOICES_CATALOG.length})` },
              { id: "female" as FilterCategory, label: "👩 أصوات حريمي (Female)" },
              { id: "male" as FilterCategory, label: "👨 أصوات رجالي (Male)" },
              { id: "US" as FilterCategory, label: "🇺🇸 لكنة أمريكية (American)" },
              { id: "UK" as FilterCategory, label: "🇬🇧 لكنة بريطانية (British)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  filter === f.id
                    ? "bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black shadow-md"
                    : "bg-white/5 hover:bg-white/10 text-[#dedbf4] border border-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Voices Grid (Scrollable) */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar min-h-[220px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredVoices.map((voice) => {
                const isSelected = settings.selectedVoiceId === voice.id;
                const isPlaying = playingVoiceId === voice.id;

                return (
                  <div
                    key={voice.id}
                    onClick={() => handleSelectVoice(voice)}
                    className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-start justify-between gap-3 relative overflow-hidden group ${
                      isSelected
                        ? "bg-gradient-to-r from-[#ffd166]/20 via-[#1a1838] to-[#41e7ff]/20 border-[#ffd166] shadow-lg ring-2 ring-[#ffd166]/40 scale-[1.01]"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-[#dedbf4]"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Avatar Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                          isSelected
                            ? "bg-[#ffd166] text-[#0c0b20] border-[#ffd166] font-black shadow-md"
                            : "bg-white/10 text-white border-white/10"
                        }`}
                      >
                        {voice.gender === "female" ? "👩" : "👨"}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-white">
                            {voice.nameAr} ({voice.name})
                          </span>
                          <span className="text-xs">{voice.flag}</span>
                          {isSelected && (
                            <span className="px-1.5 py-0.5 rounded bg-[#ffd166]/20 text-[#ffd166] text-[10px] font-bold border border-[#ffd166]/40">
                              مُفعّل الآن
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#b9b6d5]">
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-[#41e7ff] font-bold text-[10px]">
                            {voice.styleTag}
                          </span>
                          <span>•</span>
                          <span>{voice.accentAr}</span>
                        </div>

                        <p className="text-[11px] text-[#dedbf4]/80 mt-1.5 line-clamp-2 leading-relaxed">
                          {voice.descriptionAr}
                        </p>
                      </div>
                    </div>

                    {/* Preview / Listen Button */}
                    <button
                      onClick={(e) => handlePlayVoicePreview(voice, e)}
                      className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center justify-center ${
                        isPlaying
                          ? "bg-red-500 text-white shadow-md animate-pulse"
                          : isSelected
                          ? "bg-[#ffd166] text-[#0c0b20] hover:scale-110 shadow-md font-bold"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                      title={isPlaying ? "إيقاف الصوت" : "استمع لعينة من هذا الصوت"}
                    >
                      {isPlaying ? (
                        <Square className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Settings: Speed & Mute */}
          <div className="pt-3 border-t border-white/10 shrink-0 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              
              {/* Playback Speed Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[#b9b6d5] font-bold shrink-0 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-[#ffd166]" />
                  سرعة النطق:
                </span>
                <div className="grid grid-cols-4 gap-1.5 flex-1 sm:flex-initial">
                  {[
                    { speed: 0.75 as SpeechSpeed, label: "0.75x" },
                    { speed: 0.92 as SpeechSpeed, label: "0.92x" },
                    { speed: 1.0 as SpeechSpeed, label: "1.0x" },
                    { speed: 1.25 as SpeechSpeed, label: "1.25x" },
                  ].map((item) => (
                    <button
                      key={item.speed}
                      onClick={() => handleSpeedChange(item.speed)}
                      className={`px-2.5 py-1 rounded-lg border text-center font-bold text-[11px] transition-all cursor-pointer ${
                        settings.speed === item.speed
                          ? "bg-[#ffd166] text-[#0c0b20] border-[#ffd166] shadow-sm font-black"
                          : "bg-white/5 border-white/10 text-[#dedbf4] hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mute and Done Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleToggleMute}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    settings.isMuted
                      ? "bg-red-500/20 border-red-500/40 text-red-300"
                      : "bg-white/5 border-white/10 text-[#b9b6d5] hover:text-white"
                  }`}
                >
                  {settings.isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>صوت مكتوم</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>الصوت مفعل</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs hover:brightness-110 shadow-lg cursor-pointer"
                >
                  حفظ واعتماد
                </button>
              </div>

            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
