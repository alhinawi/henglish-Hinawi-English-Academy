// ==============================================================================
// HENGLISH ACADEMY - MULTIPLAYER LIVE LOBBY MODAL
// Realtime synchronized quiz battle rooms with 6-character codes
// ==============================================================================

import React, { useState } from 'react';
import { Users, Copy, Check, Play, LogOut, Sparkles, Shield, UserPlus } from 'lucide-react';
import { generateRoomCode } from '../../services/gameverseService';
import { playSound } from '../../utils/audio';

interface MultiplayerLobbyModalProps {
  onClose: () => void;
  onStartMultiplayerGame: (roomCode: string, isHost: boolean) => void;
}

export const MultiplayerLobbyModal: React.FC<MultiplayerLobbyModalProps> = ({
  onClose,
  onStartMultiplayerGame,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [createdRoomCode, setCreatedRoomCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('طالب الهنجلش');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [playersList, setPlayersList] = useState<Array<{ name: string; isReady: boolean; isHost: boolean }>>([]);
  const [isWaitingInRoom, setIsWaitingInRoom] = useState<boolean>(false);

  const handleCreateRoom = () => {
    playSound('click');
    const code = generateRoomCode();
    setCreatedRoomCode(code);
    setPlayersList([
      { name: playerName || 'المضيف (Host)', isReady: true, isHost: true },
      { name: 'بانتظار انضمام لاعب آخر...', isReady: false, isHost: false },
    ]);
    setIsWaitingInRoom(true);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    playSound('click');
    setCreatedRoomCode(inputCode.trim().toUpperCase());
    setPlayersList([
      { name: 'المضيف (Host)', isReady: true, isHost: true },
      { name: playerName || 'أنت (Player 2)', isReady: true, isHost: false },
    ]);
    setIsWaitingInRoom(true);
  };

  const handleCopyCode = () => {
    playSound('click');
    navigator.clipboard.writeText(createdRoomCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLaunchGame = () => {
    playSound('correct');
    onStartMultiplayerGame(createdRoomCode, activeTab === 'create');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl max-w-lg w-full border border-white/10 text-center space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-[#ffd166]/20 via-[#41e7ff]/20 to-[#ff4f9a]/20 border border-white/20 flex items-center justify-center mx-auto text-3xl shadow-xl">
          👥
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl font-black text-white font-['Cairo',sans-serif]">
            غرفة التحدي الجماعي المباشر
          </h3>
          <p className="text-xs text-[#b9b6d5]">
            تنافس بالوقت الحقيقي مع زملائك في الأكاديمية عبر رمز سداسي مشترك
          </p>
        </div>

        {!isWaitingInRoom ? (
          <div className="space-y-5 text-right">
            
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
              <button
                onClick={() => { playSound('click'); setActiveTab('create'); }}
                className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white shadow-md'
                    : 'text-[#b9b6d5] hover:text-white'
                }`}
              >
                إنشاء غرفة جديدة ➕
              </button>
              <button
                onClick={() => { playSound('click'); setActiveTab('join'); }}
                className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'join'
                    ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#121124] shadow-md'
                    : 'text-[#b9b6d5] hover:text-white'
                }`}
              >
                الانضمام برمز الغرفة 🔑
              </button>
            </div>

            {/* Player Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#dedbf4] font-bold block">اسمك في المعركة:</label>
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="أدخل اسمك أو لقبك..."
                className="w-full py-3 px-4 rounded-xl bg-[#09091a] border border-white/15 focus:border-[#41e7ff] text-white text-sm outline-none transition-colors"
              />
            </div>

            {/* Tab: Create Room */}
            {activeTab === 'create' && (
              <div className="space-y-4 pt-2">
                <button
                  onClick={handleCreateRoom}
                  className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-transform active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>توليد رمز الغرفة وبدء الانتظار 🚀</span>
                </button>
              </div>
            )}

            {/* Tab: Join Room */}
            {activeTab === 'join' && (
              <form onSubmit={handleJoinRoom} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#dedbf4] font-bold block">رمز الغرفة (6 خانات):</label>
                  <input
                    type="text"
                    maxLength={6}
                    dir="ltr"
                    value={inputCode}
                    onChange={e => setInputCode(e.target.value.toUpperCase())}
                    placeholder="مثال: HN7X9B"
                    className="w-full py-3 px-4 rounded-xl bg-[#09091a] border border-white/15 focus:border-[#ffd166] text-white text-center text-lg font-black font-['Outfit',sans-serif] tracking-widest outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inputCode.trim().length < 4}
                  className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#121124] font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-transform active:scale-98"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>دخول الغرفة والتحدي 🎯</span>
                </button>
              </form>
            )}

          </div>
        ) : (
          /* Waiting Room State */
          <div className="space-y-6">
            
            {/* Room Code Banner */}
            <div className="p-4 rounded-2xl bg-[#09091a] border border-[#ffd166]/30 space-y-2">
              <span className="text-[11px] text-[#ffd166] font-bold block">
                شارك هذا الرمز مع زميلك للانضمام فوراً:
              </span>
              <div className="flex items-center justify-center gap-3">
                <span
                  dir="ltr"
                  className="text-3xl font-black text-white font-['Outfit',sans-serif] tracking-widest"
                >
                  {createdRoomCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#ffd166] border border-white/10 transition-colors cursor-pointer"
                  title="نسخ الرمز"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Players in Lobby */}
            <div className="space-y-2 text-right">
              <span className="text-xs text-[#b9b6d5] font-bold block">اللاعبون المتصلون:</span>
              <div className="space-y-2">
                {playersList.map((player, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-white">{player.name}</span>
                      {player.isHost && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffd166]/15 text-[#ffd166] font-black">
                          المضيف
                        </span>
                      )}
                    </div>
                    <span className="text-emerald-400 font-bold">جاهز للمعركة ✅</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Game Button */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsWaitingInRoom(false)}
                className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs cursor-pointer border border-white/10 transition-colors"
              >
                مغادرة الغرفة
              </button>

              <button
                onClick={handleLaunchGame}
                className="py-3 px-4 rounded-2xl bg-linear-to-r from-[#c4ff55] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-transform hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>بدء المواجهة الآن!</span>
              </button>
            </div>

          </div>
        )}

        <button
          onClick={onClose}
          className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          إلغاء وإغلاق النافذة
        </button>

      </div>
    </div>
  );
};
