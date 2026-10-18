import React from 'react';
import { Bot, Volume2, VolumeX, RefreshCw, Radio, Sparkles } from 'lucide-react';
import { AgentInfo } from '../types/agent';

interface HeaderProps {
  agents: Record<string, AgentInfo>;
  isSpeaking: boolean;
  isListening: boolean;
  audioMuted: boolean;
  onToggleMute: () => void;
  onResetAll: () => void;
  lang: string;
  onLangChange: (lang: string) => void;
  onPlayWelcome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  agents,
  isSpeaking,
  isListening,
  audioMuted,
  onToggleMute,
  onResetAll,
  lang,
  onLangChange,
  onPlayWelcome,
}) => {
  return (
    <header className="border-b border-cyan-900/40 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                BOGY AGENTS AI
              </h1>
              <span className="text-[11px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold">
                SWARM OS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              برنامج وكلاء بوجي للذكاء الاصطناعي • منظومة الوكلاء الصوتية المتقدمة
            </p>
          </div>
        </div>

        {/* Live Swarm Micro-Status */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            سرب وكلاء بوجي:
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${
                agents.master?.status === 'executing'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60'
              }`}
            >
              الرئيسي
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${
                agents.windows?.status === 'executing'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60'
              }`}
            >
              ويندوز
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${
                agents.office?.status === 'executing'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60'
              }`}
            >
              المستندات
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${
                agents.web?.status === 'executing'
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 animate-pulse'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60'
              }`}
            >
              الإنترنت
            </span>
          </div>
        </div>

        {/* Global Controls & Welcome Voice Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Welcome Message Voice Button */}
          <button
            onClick={onPlayWelcome}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 hover:bg-cyan-600/40 text-cyan-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="تشغيل رسالة الترحيب: مرحباً بكم ببرنامج وكلاء بوجي"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>رسالة الترحيب</span>
          </button>

          {/* Audio Speaking Wave Indicator */}
          {isSpeaking && (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-700/50 text-cyan-400 text-xs">
              <span className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="mr-1 text-[11px]">يتحدث الوكيل...</span>
            </div>
          )}

          {/* Language Selector */}
          <select
            value={lang}
            onChange={(e) => onLangChange(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            title="لغة التعرف الصوتي"
          >
            <option value="ar-SA">العربية (السعودية)</option>
            <option value="ar-EG">العربية (مصر)</option>
            <option value="en-US">English (US)</option>
          </select>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              audioMuted
                ? 'bg-red-950/40 border-red-800/60 text-red-400 hover:bg-red-900/40'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-800'
            }`}
            title={audioMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Workspace */}
          <button
            onClick={onResetAll}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
            title="إعادة تعيين ومسح السجلات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
