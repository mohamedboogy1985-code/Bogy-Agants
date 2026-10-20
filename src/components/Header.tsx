import React from 'react';
import { Bot, Volume2, VolumeX, RefreshCw, Radio, Sparkles, Sun, Moon, PanelRightOpen, PanelRightClose } from 'lucide-react';
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
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
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
  theme,
  onToggleTheme,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <header
      className={`border-b sticky top-0 z-50 backdrop-blur-xl transition-colors duration-200 ${
        theme === 'dark'
          ? 'border-cyan-900/40 bg-slate-950/85 text-slate-100'
          : 'border-slate-200 bg-white/90 text-slate-800 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          {/* Mobile Sidebar Toggle */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl border lg:hidden cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="عرض/إخفاء سايد بار الوكلاء"
            >
              {isSidebarOpen ? <PanelRightClose className="w-5 h-5 text-cyan-400" /> : <PanelRightOpen className="w-5 h-5 text-cyan-400" />}
            </button>
          )}

          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div
                className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  theme === 'dark' ? 'bg-slate-950' : 'bg-white'
                }`}
              >
                <Bot className="w-6 h-6 text-cyan-500" />
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
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">
                BOGY AGENTS AI
              </h1>
              <span
                className={`text-[11px] font-mono tracking-wider px-2 py-0.5 rounded-full font-semibold border ${
                  theme === 'dark'
                    ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60'
                    : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                }`}
              >
                SWARM OS
              </span>
            </div>
            <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              برنامج وكلاء بوجي للذكاء الاصطناعي • منظومة الوكلاء الصوتية المتقدمة
            </p>
          </div>
        </div>

        {/* Live Swarm Micro-Status */}
        <div
          className={`hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs ${
            theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            وكلاء بوجي النشطون:
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${
                agents.master?.status === 'executing'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                  : theme === 'dark'
                  ? 'bg-slate-800/60 text-slate-300 border-slate-700/60'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              الرئيسي
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${
                agents.startup?.status === 'executing'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : theme === 'dark'
                  ? 'bg-slate-800/60 text-slate-300 border-slate-700/60'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              الإقلاع ⚡
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${
                agents.windows?.status === 'executing'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                  : theme === 'dark'
                  ? 'bg-slate-800/60 text-slate-300 border-slate-700/60'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              ويندوز
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${
                agents.office?.status === 'executing'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : theme === 'dark'
                  ? 'bg-slate-800/60 text-slate-300 border-slate-700/60'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              الأوفيس
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] border font-medium ${
                agents.web?.status === 'executing'
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 animate-pulse'
                  : theme === 'dark'
                  ? 'bg-slate-800/60 text-slate-300 border-slate-700/60'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              الإنترنت
            </span>
          </div>
        </div>

        {/* Global Controls: Welcome, Speaking Wave, Dark/Light Toggle, Language, Mute, Reset */}
        <div className="flex items-center gap-2">
          {/* Welcome Message Voice Button */}
          <button
            onClick={onPlayWelcome}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-cyan-500/50 hover:bg-cyan-600/40 text-cyan-300'
                : 'bg-cyan-50 border-cyan-300 hover:bg-cyan-100 text-cyan-800'
            }`}
            title="تشغيل رسالة الترحيب: مرحباً بكم ببرنامج وكلاء بوجي"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>رسالة الترحيب</span>
          </button>

          {/* Audio Speaking Wave Indicator */}
          {isSpeaking && (
            <div
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs ${
                theme === 'dark'
                  ? 'bg-cyan-950/70 border-cyan-700/50 text-cyan-400'
                  : 'bg-cyan-50 border-cyan-200 text-cyan-800'
              }`}
            >
              <span className="w-1.5 h-3 bg-cyan-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-4 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1.5 h-2.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="mr-1 text-[11px] font-semibold">ينطق الوكيل...</span>
            </div>
          )}

          {/* Dark / Light Theme Toggle Switch */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800 hover:border-amber-400/50'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300'
            }`}
            title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح (Light Mode)' : 'التبديل إلى الوضع الداكن (Dark Mode)'}
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Language Selector */}
          <select
            value={lang}
            onChange={(e) => onLangChange(e.target.value)}
            className={`text-xs rounded-xl px-2.5 py-2 border focus:outline-none focus:border-cyan-500 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
            title="لغة التعرف الصوتي"
          >
            <option value="ar-SA">العربية (السعودية)</option>
            <option value="ar-EG">العربية (مصر)</option>
            <option value="en-US">English (US)</option>
          </select>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              audioMuted
                ? 'bg-red-950/40 border-red-800/60 text-red-400 hover:bg-red-900/40'
                : theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-cyan-700'
            }`}
            title={audioMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Workspace */}
          <button
            onClick={onResetAll}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
            title="إعادة تعيين ومسح السجلات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
