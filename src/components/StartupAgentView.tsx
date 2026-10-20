import React, { useState } from 'react';
import {
  Power,
  RotateCw,
  Volume2,
  CheckCircle2,
  Cpu,
  HardDrive,
  ShieldCheck,
  Zap,
  Sparkles,
  Play,
  Terminal,
  Settings,
  Bell,
  ArrowRight,
  Radio,
  FileSpreadsheet,
  Globe,
} from 'lucide-react';
import { AgentInfo } from '../types/agent';

interface StartupAgentViewProps {
  agent: AgentInfo;
  theme: 'dark' | 'light';
  onSimulateBoot: () => void;
  onPlayGreeting: () => void;
  onExecuteQuickCommand: (prompt: string) => void;
  isProcessing: boolean;
  isSpeaking: boolean;
}

export const StartupAgentView: React.FC<StartupAgentViewProps> = ({
  agent,
  theme,
  onSimulateBoot,
  onPlayGreeting,
  onExecuteQuickCommand,
  isProcessing,
  isSpeaking,
}) => {
  const [autoRunEnabled, setAutoRunEnabled] = useState(true);
  const [voiceGreetingEnabled, setVoiceGreetingEnabled] = useState(true);
  const [deepDiagnosticEnabled, setDeepDiagnosticEnabled] = useState(true);

  const BOOT_CHECKLIST = [
    {
      title: 'نواة وخدمات نظام ويندوز (Windows Kernel & Services)',
      status: 'جاهز 100%',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      detail: 'تم فحص العمليات وسجلات النظام عند الإقلاع بنجاح',
    },
    {
      title: 'محرك الأصوات البشرية والذكاء الاصطناعي (Gemini & Voice Engine)',
      status: 'نشط ويعمل',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      detail: 'نظام النطق الطبيعي والاستماع الصوتي جاهز لاستقبال الأوامر',
    },
    {
      title: 'محرك مستندات الأوفيس والإكسيل (Office Engine)',
      status: 'متصل ومحمل',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
      detail: 'مكتبات إنشاء وتوليد ملفات XLSX وDOCX جاهزة فورياً',
    },
    {
      title: 'بروتوكولات الإنترنت والتصفح والتحميل (Web Navigator)',
      status: 'متصل بالشبكة',
      icon: <Globe className="w-4 h-4 text-violet-400" />,
      detail: 'الاتصال فائق السرعة جاهز لتنفيذ مهام التصفح والتنزيل',
    },
  ];

  const QUICK_COMMANDS = [
    {
      title: 'فحص صحة النظام وموارد المعالج',
      desc: 'استدعاء وكيل ويندوز لفحص استهلاك الذاكرة وسجلات النظام',
      prompt: 'افحص استهلاك المعالج والذاكرة في ويندوز وقدم تقرير بالحالة',
      category: 'نظام ويندوز',
      color: 'blue',
    },
    {
      title: 'إنشاء جدول مالي ومبيعات يومي في إكسيل',
      desc: 'توليد ملف XLSX فوري مع حساب الإيرادات وهوامش الربح',
      prompt: 'أنشئ جدول إكسيل لمبيعات اليوم مع معادلات الأرباح والمجموع',
      category: 'إكسيل وأوفيس',
      color: 'emerald',
    },
    {
      title: 'البحث عن أحدث المستجدات وتلخيصها',
      desc: 'استكشاف الويب بجوجل وتلخيص تقرير موجز مع روابط التنزيل',
      prompt: 'ابحث في الإنترنت عن آخر أخبار الذكاء الاصطناعي ولخصها',
      category: 'الإنترنت والويب',
      color: 'violet',
    },
    {
      title: 'تنظيف المخلفات المؤقتة وتحسين الأداء',
      desc: 'تشغيل أوامر الصيانة الدورية المؤتمتة لحفظ سرعة الجهاز',
      prompt: 'قم بإجراء صيانة مؤتمتة لنظام ويندوز وحذف الملفات المؤقتة',
      category: 'صيانة النظام',
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Boot Control Banner */}
      <div
        className={`rounded-2xl p-6 border relative overflow-hidden transition-all shadow-xl ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border-amber-500/40 text-slate-100'
            : 'bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-amber-300 text-slate-900 shadow-amber-500/5'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center shrink-0">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                  theme === 'dark' ? 'bg-slate-950 text-amber-400' : 'bg-white text-amber-600'
                }`}
              >
                <Power className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
                  وكيل بدء التشغيل والإقلاع التلقائي (Bogy Auto-Boot Agent)
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  AUTO-START ONLINE ⚡
                </span>
              </div>
              <p className={`text-sm mt-1.5 leading-relaxed max-w-3xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                يعمل هذا الوكيل فور تشغيل جهاز الكمبيوتر، حيث يقوم فوراً بالترحيب بك بصوت طبيعي دافئ، وفحص استقرار خدمات ويندوز، وعرض المساعدة المباشرة لتنفيذ أي أوامر أو تشغيل التطبيقات دون أي تأخير!
              </p>
            </div>
          </div>

          {/* Boot Control Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
            {/* Simulate PC Reboot */}
            <button
              onClick={onSimulateBoot}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
              title="محاكاة إعادة تشغيل الكمبيوتر واختبار الإقلاع التلقائي والترحيب"
            >
              <RotateCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>محاكاة إقلاع الكمبيوتر 🔄</span>
            </button>

            {/* Play Greeting Speech */}
            <button
              onClick={onPlayGreeting}
              disabled={isSpeaking}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900 border-amber-500/40 text-amber-300 hover:bg-amber-950/40'
                  : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-50'
              }`}
              title="تشغيل رسالة الترحيب التلقائية"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>استمع لترحيب الإقلاع</span>
            </button>
          </div>
        </div>
      </div>

      {/* Boot Checklist & System Readiness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BOOT_CHECKLIST.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 border transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                  }`}
                >
                  {item.icon}
                </div>
                <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  {item.title}
                </h4>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                {item.status}
              </span>
            </div>
            <p className={`text-xs pr-10.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Assistance Hub (مساعد الإقلاع لتنفيذ أي أوامر) */}
      <div
        className={`rounded-2xl p-5 border transition-all ${
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                مركز المساعدة الفورية لتنفيذ الأوامر (Quick Assistance Hub)
              </h3>
              <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                لا توجد أوامر بعد؟ اضغط على أي مهمة أدناه ليقوم وكلاء بوجي بتنفيذها فوراً بدقة عالية:
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-mono hidden sm:inline">
            جاهز لتلقي أي توجيه 🚀
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {QUICK_COMMANDS.map((item, index) => (
            <div
              key={index}
              onClick={() => onExecuteQuickCommand(item.prompt)}
              className={`group p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                theme === 'dark'
                  ? 'bg-slate-950/70 border-slate-800 hover:border-amber-500/60 hover:bg-slate-900'
                  : 'bg-slate-50 border-slate-200 hover:border-amber-500/60 hover:bg-amber-50/40 shadow-xs'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold mb-2 inline-block">
                  {item.category}
                </span>
                <h4
                  className={`text-xs font-bold transition-colors group-hover:text-amber-400 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  {item.title}
                </h4>
                <p className={`text-[11px] mt-1.5 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.desc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-amber-400 font-medium group-hover:translate-x-[-2px] transition-transform">
                <span>تنفيذ فوري</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Start & Windows Preferences */}
      <div
        className={`rounded-2xl p-5 border transition-all ${
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-amber-400" />
          <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
            إعدادات الإقلاع التلقائي في ويندوز (Startup Preferences)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Toggle 1: Auto-boot */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
            onClick={() => setAutoRunEnabled(!autoRunEnabled)}
          >
            <div>
              <p className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                التشغيل التلقائي مع ويندوز
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                بدء الخدمة فور إقلاع النظام
              </p>
            </div>
            <div
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                autoRunEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoRunEnabled ? 'translate-x-[-20px]' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Toggle 2: Voice Welcome on Startup */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
            onClick={() => setVoiceGreetingEnabled(!voiceGreetingEnabled)}
          >
            <div>
              <p className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                الترحيب الصوتي التلقائي
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                نطق رسالة ترحيبية فور الإقلاع
              </p>
            </div>
            <div
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                voiceGreetingEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  voiceGreetingEnabled ? 'translate-x-[-20px]' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Toggle 3: Diagnostics on boot */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
            onClick={() => setDeepDiagnosticEnabled(!deepDiagnosticEnabled)}
          >
            <div>
              <p className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                فحص الموارد والذاكرة
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                مراقبة الأداء فور الإقلاع
              </p>
            </div>
            <div
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                deepDiagnosticEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  deepDiagnosticEnabled ? 'translate-x-[-20px]' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
