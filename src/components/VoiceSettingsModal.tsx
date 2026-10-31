import React, { useState, useEffect } from "react";
import {
  getVoiceSettings,
  setVoiceGender,
  setVoiceAccent,
  setVoiceSpeed,
  toggleAudioMute,
  speakEnglishVoice,
  stopSpeech,
  VoiceGender,
  VoiceAccent,
  SpeechSpeed,
} from "../utils/audio";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState(getVoiceSettings());
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getVoiceSettings());
    }
  }, [isOpen]);

  const handleGenderChange = (gender: VoiceGender) => {
    setVoiceGender(gender);
    setSettings((prev) => ({ ...prev, gender }));
  };

  const handleAccentChange = (accent: VoiceAccent) => {
    setVoiceAccent(accent);
    setSettings((prev) => ({ ...prev, accent }));
  };

  const handleSpeedChange = (speed: SpeechSpeed) => {
    setVoiceSpeed(speed);
    setSettings((prev) => ({ ...prev, speed }));
  };

  const handleToggleMute = () => {
    const isMuted = toggleAudioMute();
    setSettings((prev) => ({ ...prev, isMuted }));
  };

  const playSample = () => {
    setIsPlayingSample(true);
    const sampleText =
      settings.gender === "male"
        ? "Welcome to Henglish Academy. By this time next week, you will have mastered English pronunciation."
        : "Welcome to Henglish Academy. Consistency is the secret to mastering fluent English conversation.";

    speakEnglishVoice(sampleText, {
      gender: settings.gender,
      accent: settings.accent,
      speed: settings.speed,
      onEnd: () => setIsPlayingSample(false),
    });
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlayingSample(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#171632] border border-white/15 p-6 sm:p-8 shadow-2xl text-right z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#b9b6d5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="إغلاق نافذة إعدادات الصوت"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#ffd166]/20 to-[#41e7ff]/20 border border-[#ffd166]/40 flex items-center justify-center text-[#ffd166]">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  إعدادات الصوت والنطق الصوتي
                </h3>
                <p className="text-xs text-[#b9b6d5]">
                  تخصيص المعلم الصوتي، اللهجة، وسرعة النطق
                </p>
              </div>
            </div>
          </div>

          {/* 1. Voice Gender Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#dedbf4] flex items-center justify-end gap-1.5">
              <span>اختيار الصوت (الصوت الأنثوي والذكوري الطبيعي)</span>
              <Mic className="w-3.5 h-3.5 text-[#ffd166]" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Female Voice */}
              <button
                onClick={() => handleGenderChange("female")}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  settings.gender === "female"
                    ? "bg-linear-to-br from-[#ff4f9a]/25 to-[#ffd166]/15 border-[#ff4f9a] text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-[#b9b6d5] hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm font-black">
                    صوت أنثوي (الأصلي) 👩‍🏫
                  </span>
                  {settings.gender === "female" && (
                    <Check className="w-4 h-4 text-[#ffd166]" />
                  )}
                </div>
                <span className="text-[11px] opacity-80">
                  الصوت المعتمد والواضح للمنصة
                </span>
              </button>

              {/* Male Voice (Upgraded natural) */}
              <button
                onClick={() => handleGenderChange("male")}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  settings.gender === "male"
                    ? "bg-linear-to-br from-[#41e7ff]/25 to-[#c4ff55]/15 border-[#41e7ff] text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-[#b9b6d5] hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm font-black">صوت ذكوري طبيعي 👨‍🏫</span>
                  {settings.gender === "male" && (
                    <Check className="w-4 h-4 text-[#41e7ff]" />
                  )}
                </div>
                <span className="text-[11px] text-[#41e7ff] font-bold">
                  صوت دافئ ومطور (Native Voice)
                </span>
              </button>
            </div>
          </div>

          {/* 2. Accent Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#dedbf4] flex items-center justify-end gap-1.5">
              <span>اللهجة الإنجليزية المعتمدة</span>
              <Globe className="w-3.5 h-3.5 text-[#41e7ff]" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAccentChange("US")}
                className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                  settings.accent === "US"
                    ? "bg-[#41e7ff]/20 border-[#41e7ff] text-white"
                    : "bg-white/5 border-white/10 text-[#b9b6d5] hover:bg-white/10"
                }`}
              >
                🇺🇸 الإنجليزية الأمريكية (American)
              </button>
              <button
                onClick={() => handleAccentChange("UK")}
                className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                  settings.accent === "UK"
                    ? "bg-[#ffd166]/20 border-[#ffd166] text-white"
                    : "bg-white/5 border-white/10 text-[#b9b6d5] hover:bg-white/10"
                }`}
              >
                🇬🇧 الإنجليزية البريطانية (British)
              </button>
            </div>
          </div>

          {/* 3. Speed Control */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#dedbf4]">
              <span className="text-[#ffd166] font-mono">
                {settings.speed}x
              </span>
              <span className="flex items-center gap-1.5">
                سرعة النطق الصوتي
                <Gauge className="w-3.5 h-3.5 text-[#c4ff55]" />
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { speed: 0.75 as SpeechSpeed, label: "0.75x بطيء" },
                { speed: 0.92 as SpeechSpeed, label: "0.92x تعليمي" },
                { speed: 1.0 as SpeechSpeed, label: "1.0x عادي" },
                { speed: 1.25 as SpeechSpeed, label: "1.25x سريع" },
              ].map((item) => (
                <button
                  key={item.speed}
                  onClick={() => handleSpeedChange(item.speed)}
                  className={`py-2 rounded-xl border text-center text-[11px] font-bold transition-all cursor-pointer ${
                    settings.speed === item.speed
                      ? "bg-linear-to-r from-[#ffd166]/20 to-[#ff4f9a]/20 border-[#ffd166] text-[#ffd166]"
                      : "bg-white/5 border-white/10 text-[#b9b6d5] hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Audio Mute Toggle & Preview Test */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleToggleMute}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                settings.isMuted
                  ? "bg-[#ff4f9a]/20 border-[#ff4f9a] text-[#ff8bb9]"
                  : "bg-white/5 border-white/10 text-[#dedbf4] hover:bg-white/10"
              }`}
            >
              {settings.isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#c4ff55]" />
              )}
              <span>
                {settings.isMuted
                  ? "الصوت مكتوم (Muted)"
                  : "المؤثرات الصوتية مفعلة"}
              </span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isPlayingSample ? (
                <button
                  onClick={handleStop}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-500/30 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>إيقاف المعاينة</span>
                </button>
              ) : (
                <button
                  onClick={playSample}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#ffd166] text-[#121128] text-xs font-black flex items-center justify-center gap-2 hover:brightness-110 shadow-lg cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>تجربة الصوت الآن ⚡</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
