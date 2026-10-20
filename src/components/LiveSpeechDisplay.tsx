import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Copy, Check, Sparkles, Mic, ChevronDown, ChevronUp } from 'lucide-react';
import { AgentId, AgentInfo } from '../types/agent';

interface LiveSpeechDisplayProps {
  spokenText: string;
  speakerId?: AgentId | 'user' | string;
  speakerName?: string;
  isSpeaking: boolean;
  isListening: boolean;
  audioMuted: boolean;
  theme: 'dark' | 'light';
  onReplay?: (text: string) => void;
  onStopSpeaking?: () => void;
  agents?: Record<AgentId, AgentInfo>;
}

export const LiveSpeechDisplay: React.FC<LiveSpeechDisplayProps> = ({
  spokenText,
  speakerId = 'master',
  speakerName,
  isSpeaking,
  isListening,
  audioMuted,
  theme,
  onReplay,
  onStopSpeaking,
  agents,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!spokenText && !isListening && !isSpeaking) {
    return null;
  }

  const handleCopy = () => {
    if (!spokenText) return;
    navigator.clipboard.writeText(spokenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSpeakerDetails = () => {
    if (speakerId === 'user' || isListening) {
      return {
        name: 'صوتك المسموع (المستخدم)',
        tag: 'أمر صوتي مباشر',
        colorClass: theme === 'dark' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-red-50 text-red-700 border-red-200',
        glowClass: 'shadow-red-500/10',
        borderColor: theme === 'dark' ? 'border-red-500/30' : 'border-red-300',
      };
    }

    if (speakerId === 'startup') {
      return {
        name: speakerName || agents?.startup?.nameAr || 'وكيل بدء التشغيل والإقلاع (Bogy Boot)',
        tag: 'إقلاع النظام التلقائي',
        colorClass: theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-50 text-amber-700 border-amber-200',
        glowClass: 'shadow-amber-500/15',
        borderColor: theme === 'dark' ? 'border-amber-500/40' : 'border-amber-300',
      };
    }

    if (speakerId === 'windows') {
      return {
        name: speakerName || agents?.windows?.nameAr || 'وكيل نظام ويندوز (Bogy WinSys)',
        tag: 'تحكم ويندوز',
        colorClass: theme === 'dark' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-blue-50 text-blue-700 border-blue-200',
        glowClass: 'shadow-blue-500/15',
        borderColor: theme === 'dark' ? 'border-blue-500/40' : 'border-blue-300',
      };
    }

    if (speakerId === 'office') {
      return {
        name: speakerName || agents?.office?.nameAr || 'وكيل المستندات والأوفيس (Bogy Office)',
        tag: 'إكسيل ووورد',
        colorClass: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
        glowClass: 'shadow-emerald-500/15',
        borderColor: theme === 'dark' ? 'border-emerald-500/40' : 'border-emerald-300',
      };
    }

    if (speakerId === 'web') {
      return {
        name: speakerName || agents?.web?.nameAr || 'وكيل الإنترنت والتحميل (Bogy Web)',
        tag: 'ويب وتنزيلات',
        colorClass: theme === 'dark' ? 'bg-violet-500/20 text-violet-300 border-violet-500/40' : 'bg-violet-50 text-violet-700 border-violet-200',
        glowClass: 'shadow-violet-500/15',
        borderColor: theme === 'dark' ? 'border-violet-500/40' : 'border-violet-300',
      };
    }

    return {
      name: speakerName || agents?.master?.nameAr || 'الوكيل العام (Bogy Prime)',
      tag: 'سرب بوجي للذكاء الاصطناعي',
      colorClass: theme === 'dark' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-cyan-50 text-cyan-700 border-cyan-200',
      glowClass: 'shadow-cyan-500/15',
      borderColor: theme === 'dark' ? 'border-cyan-500/40' : 'border-cyan-300',
    };
  };

  const speaker = getSpeakerDetails();

  return (
    <div
      className={`relative w-full rounded-2xl border transition-all duration-300 shadow-lg ${speaker.borderColor} ${speaker.glowClass} ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-slate-900/95 via-slate-950/95 to-slate-900/95 text-slate-100 backdrop-blur-xl'
          : 'bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 text-slate-900 shadow-slate-200 backdrop-blur-xl'
      }`}
    >
      {/* Header bar of speech capsule */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2.5">
          {isListening ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-bold animate-pulse">
              <Mic className="w-3.5 h-3.5 animate-bounce" />
              <span>جاري استماع صوتك الآن...</span>
            </div>
          ) : isSpeaking ? (
            <div className="flex items-center gap-2">
              <span className="flex items-end gap-0.5 h-4">
                <span className="w-1 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0s]" />
                <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                <span className="w-1 h-4.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.25s]" />
              </span>
              <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
                جاري النطق الصوتي الحي...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>شريط عرض الكلام المنطوق (Live Voice Teleprompter)</span>
            </div>
          )}

          {/* Speaker Badge */}
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${speaker.colorClass}`}>
            {speaker.name}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            disabled={!spokenText}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="نسخ النص المنطوق"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Replay button */}
          {onReplay && spokenText && (
            <button
              onClick={() => onReplay(spokenText)}
              disabled={isSpeaking || audioMuted}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300 hover:bg-cyan-900/60'
                  : 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100'
              }`}
              title="إعادة نطق الكلام بصوت طبيعي"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إعادة النطق</span>
            </button>
          )}

          {/* Stop button */}
          {isSpeaking && onStopSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 text-xs font-medium cursor-pointer"
              title="إيقاف الصوت حالياً"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إيقاف</span>
            </button>
          )}

          {/* Minimize toggle */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title={isMinimized ? 'توسيع عرض الكلام' : 'طي العرض'}
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Spoken Speech Body */}
      {!isMinimized && (
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center border shadow-sm ${
                isSpeaking ? 'animate-pulse' : ''
              } ${speaker.colorClass}`}
            >
              <Volume2 className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm sm:text-base font-semibold leading-relaxed tracking-wide ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                }`}
              >
                {spokenText || 'بانتظار الكلام أو الأوامر الصوتية...'}
              </p>

              {/* Real-time speaking status footer */}
              <div className="mt-2.5 flex items-center gap-3 text-xs">
                <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
                  {isSpeaking ? 'يتكلم الوكيل بصوت بشري طبيعي' : 'تم اكتمال النطق'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-[11px]">
                  برنامج وكلاء بوجي للذكاء الاصطناعي (Bogy Agents AI)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
