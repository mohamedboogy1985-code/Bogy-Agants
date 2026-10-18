import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles, Volume2, AudioWaveform as Waveform, Play, CornerDownLeft } from 'lucide-react';

interface VoiceControllerProps {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onSubmitCommand: (cmd: string) => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  isListening,
  isProcessing,
  transcript,
  onStartListening,
  onStopListening,
  onSubmitCommand,
}) => {
  const [inputText, setInputText] = useState('');

  // Preset voice commands that demonstrate full agent coordination
  const PRESET_COMMANDS = [
    {
      label: 'تقرير مالي 2025 مع فحص ويندوز وبحث السوق',
      prompt: 'أنشئ تقرير أرباح ومبيعات لسنة 2025 في ملف إكسيل مع معادلات الجمع وهوامش الربح، ثم ابحث على الإنترنت عن توقعات السوق ولخصها في مستند وورد، وافحص أداء الذاكرة والمعالج في ويندوز.',
      badge: 'متعدد الوكلاء ⚡',
    },
    {
      label: 'صيانة ويندوز وسكربت أتمتة',
      prompt: 'قم بفحص خدمات نظام ويندوز المتوقفة، ونظف الملفات المؤقتة في C:\\Windows\\Temp وأنشئ سكربت PowerShell لجدولة النسخ الاحتياطي التلقائي.',
      badge: 'وكيل ويندوز 💻',
    },
    {
      label: 'جدول رواتب إكسيل ومستند وورد رسمي',
      prompt: 'صمم جدول رواتب ومكافآت الموظفين في ملف إكسيل مع حساب الضرائب وصافي الراتب، ثم اكتب مسودة خطاب رسمي في ملف وورد لصرف المكافآت.',
      badge: 'وكيل المستندات 📊',
    },
    {
      label: 'بحث ويب وتنزيل مراجع الذكاء الاصطناعي',
      prompt: 'ابحث على الإنترنت عن أفضل نماذج الذكاء الاصطناعي مفتوحة المصدر لعام 2025 واستخرج المراجع وروابط المقالات وأضف ملف التقرير إلى قائمة التحميل.',
      badge: 'وكيل الإنترنت 🌐',
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing) {
      onSubmitCommand(inputText.trim());
      setInputText('');
    }
  };

  const handleSelectPreset = (p: string) => {
    if (!isProcessing) {
      onSubmitCommand(p);
    }
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Background ambient glow effect */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left/Center: Dynamic Voice Interaction Hub */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Glowing Voice Mic Button */}
          <div className="relative flex-shrink-0">
            {isListening && (
              <>
                <div className="absolute -inset-3 rounded-full bg-cyan-500/20 animate-ping opacity-75" />
                <div className="absolute -inset-1.5 rounded-full bg-cyan-400/30 animate-pulse" />
              </>
            )}

            <button
              onClick={isListening ? onStopListening : onStartListening}
              disabled={isProcessing}
              className={`relative z-10 w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                isListening
                  ? 'bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 text-white scale-105 shadow-red-500/30'
                  : isProcessing
                  ? 'bg-slate-800 text-cyan-400 cursor-wait animate-pulse'
                  : 'bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 text-white hover:scale-105 hover:shadow-cyan-500/40'
              }`}
              title={isListening ? 'اضغط للإيقاف' : 'اضغط للتحدث بالأمر الصوتي'}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 animate-bounce" />
              ) : isProcessing ? (
                <Sparkles className="w-8 h-8 animate-spin" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Voice State & Wave Visualizer */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isListening ? 'bg-red-500 animate-ping' : isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                {isListening ? 'جاري الاستماع لصوتك...' : isProcessing ? 'الوكيل العام يخطط وينسق...' : 'جاهز لاستقبال الأوامر الصوتية'}
              </span>
            </div>

            {/* Simulated Live Audio Waveform */}
            <div className="h-6 flex items-center gap-1">
              {Array.from({ length: 24 }).map((_, i) => {
                const heightClass = isListening
                  ? [
                      'h-2', 'h-4', 'h-5', 'h-3', 'h-6', 'h-5', 'h-3', 'h-6',
                      'h-4', 'h-2', 'h-5', 'h-6', 'h-3', 'h-5', 'h-2', 'h-4',
                      'h-6', 'h-3', 'h-5', 'h-4', 'h-2', 'h-5', 'h-3', 'h-2'
                    ][i % 24]
                  : 'h-1.5';
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${heightClass} ${
                      isListening
                        ? 'bg-gradient-to-t from-cyan-400 to-blue-300'
                        : isProcessing
                        ? 'bg-amber-400/40'
                        : 'bg-slate-700/60'
                    }`}
                  />
                );
              })}
            </div>

            {/* Transcript Preview */}
            <p className="text-xs text-slate-400 mt-1 truncate max-w-md">
              {transcript ? (
                <span className="text-cyan-200 font-medium">"{transcript}"</span>
              ) : (
                'تحدث بصوتك مباشرة أو اختر نموذجاً من الأسفل...'
              )}
            </p>
          </div>
        </div>

        {/* Right: Text Input Alternative */}
        <form onSubmit={handleFormSubmit} className="w-full md:w-auto flex-1 max-w-xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب أمراً للوكلاء أو اضغط زر الميكروفون للتحدث..."
              disabled={isProcessing}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 pl-12 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="absolute left-2 p-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-30 disabled:hover:bg-cyan-600 transition-all cursor-pointer"
              title="إرسال الأمر"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </form>
      </div>

      {/* Preset Voice Prompts Bar */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-slate-400 font-medium">نماذج أوامر صوتية متكاملة وسريعة التجربة:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_COMMANDS.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(cmd.prompt)}
              disabled={isProcessing}
              className="group text-right p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-xs flex flex-col justify-between gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {cmd.badge}
                </span>
                <Play className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-slate-200 font-medium line-clamp-2 leading-relaxed">
                {cmd.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
