import React from 'react';
import {
  Bot,
  Power,
  Terminal,
  FileSpreadsheet,
  Globe,
  Activity,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Zap,
  Volume2,
} from 'lucide-react';
import { AgentId, AgentInfo } from '../types/agent';

interface AgentSwarmViewProps {
  agents: Record<AgentId, AgentInfo>;
  activeTab: AgentId | 'swarm' | 'analytics' | string;
  onSelectAgentTab: (id: AgentId) => void;
  onAgentIntroduce: (id: AgentId) => void;
  isProcessing: boolean;
  theme?: 'dark' | 'light';
}

export const AgentSwarmView: React.FC<AgentSwarmViewProps> = ({
  agents,
  activeTab,
  onSelectAgentTab,
  onAgentIntroduce,
  theme = 'dark',
}) => {
  const getStatusBadge = (status: AgentInfo['status']) => {
    switch (status) {
      case 'executing':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            ينفذ مهمة
          </span>
        );
      case 'planning':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse">
            <Activity className="w-3 h-3 animate-pulse" />
            تخطيط وتوزيع
          </span>
        );
      case 'listening':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            استماع صوتي
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            اكتمل الإنجاز
          </span>
        );
      default:
        return (
          <span
            className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border ${
              theme === 'dark' ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            جاهز ومتاح
          </span>
        );
    }
  };

  const handleAgentClick = (id: AgentId) => {
    onSelectAgentTab(id);
    onAgentIntroduce(id);
  };

  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-md transition-all ${
        theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold">
            سرب وكلاء بوجي الذكي (Bogy Agents Swarm Topology)
          </h2>
        </div>
        <span
          className={`text-xs flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg border ${
            theme === 'dark'
              ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50'
              : 'bg-cyan-50 text-cyan-700 border-cyan-200'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          اضغط على أي وكيل ليعرّف بنفسه صوتياً
        </span>
      </div>

      {/* Visual Hierarchy Layout */}
      <div className="flex flex-col items-center">
        {/* Top: Master Orchestrator Agent */}
        <div className="w-full max-w-xl">
          <div
            onClick={() => handleAgentClick('master')}
            className={`cursor-pointer rounded-xl p-4 transition-all duration-300 border relative group ${
              activeTab === 'master'
                ? 'bg-gradient-to-r from-cyan-950/90 via-slate-900 to-cyan-950/90 border-cyan-400 shadow-xl shadow-cyan-500/25 ring-1 ring-cyan-400/50'
                : theme === 'dark'
                ? 'bg-slate-900/80 border-slate-700/80 hover:border-cyan-500/70 hover:bg-slate-900'
                : 'bg-slate-50 border-slate-200 hover:border-cyan-500 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">{agents.master?.nameAr}</h3>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-700 font-semibold">
                      BOGY PRIME
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{agents.master?.roleAr}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAgentClick('master');
                  }}
                  className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 transition-colors"
                  title="استمع إلى تعريف الوكيل العام بنفسه"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                {getStatusBadge(agents.master?.status)}
              </div>
            </div>

            {agents.master?.currentTask && (
              <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs text-cyan-300 flex items-center gap-2 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-slate-400">المهمة الحالية:</span>
                <span className="truncate">{agents.master.currentTask}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Branching Conduits */}
        <div className="w-full max-w-4xl h-8 relative flex items-center justify-center">
          <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-slate-700" />
          <div className="absolute bottom-0 w-11/12 h-0.5 bg-slate-700" />
        </div>

        {/* Bottom: 4 Specialized Executive Sub-Agents (Startup, Windows, Office, Web) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
          {/* Sub-Agent 0: Startup & Auto-Boot */}
          {agents.startup && (
            <div
              onClick={() => handleAgentClick('startup')}
              className={`cursor-pointer rounded-xl p-4 transition-all duration-300 border relative group ${
                activeTab === 'startup'
                  ? 'bg-gradient-to-b from-amber-950/90 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/25 ring-1 ring-amber-400/50'
                  : theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/70 hover:bg-slate-900'
                  : 'bg-slate-50 border-slate-200 hover:border-amber-500 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Power className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgentClick('startup');
                    }}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 transition-colors"
                    title="استمع إلى تعريف وكيل الإقلاع والترحيب بنفسه"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  {getStatusBadge(agents.startup.status)}
                </div>
              </div>

              <h4 className="font-bold text-sm truncate">{agents.startup.nameAr}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                يبدأ فور تشغيل جهاز الكمبيوتر، يرحب تلقائياً ويعرض المساعدة الفورية
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono text-amber-400">
                  <Zap className="w-3.5 h-3.5" />
                  إقلاع تلقائي
                </span>
                <span className="font-mono text-amber-400 font-semibold">
                  {agents.startup.completedTasksCount} عمليات
                </span>
              </div>
            </div>
          )}

          {/* Sub-Agent 1: Windows OS */}
          <div
            onClick={() => handleAgentClick('windows')}
            className={`cursor-pointer rounded-xl p-4 transition-all duration-300 border relative group ${
              activeTab === 'windows'
                ? 'bg-gradient-to-b from-blue-950/90 to-slate-900 border-blue-400 shadow-xl shadow-blue-500/25 ring-1 ring-blue-400/50'
                : theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/70 hover:bg-slate-900'
                : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-400 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAgentClick('windows');
                  }}
                  className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40 transition-colors"
                  title="استمع إلى تعريف وكيل ويندوز بنفسه"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                {getStatusBadge(agents.windows?.status)}
              </div>
            </div>

            <h4 className="font-bold text-sm truncate">{agents.windows?.nameAr}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
              PowerShell, CMD, السجلات، فحص العمليات، وأتمتة سكربتات الويندوز
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-blue-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                صلاحيات كاملة
              </span>
              <span className="font-mono text-blue-400 font-semibold">
                {agents.windows?.completedTasksCount} مهام
              </span>
            </div>
          </div>

          {/* Sub-Agent 2: Office (Excel + Word) */}
          <div
            onClick={() => handleAgentClick('office')}
            className={`cursor-pointer rounded-xl p-4 transition-all duration-300 border relative group ${
              activeTab === 'office'
                ? 'bg-gradient-to-b from-emerald-950/90 to-slate-900 border-emerald-400 shadow-xl shadow-emerald-500/25 ring-1 ring-emerald-400/50'
                : theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/70 hover:bg-slate-900'
                : 'bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAgentClick('office');
                  }}
                  className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-colors"
                  title="استمع إلى تعريف وكيل المستندات بنفسه"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                {getStatusBadge(agents.office?.status)}
              </div>
            </div>

            <h4 className="font-bold text-sm truncate">{agents.office?.nameAr}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
              جداول إكسيل حقيقية (XLSX) بمعادلات حسابية ومستندات وورد (DOCX)
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                معادلات + تصدير
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                {agents.office?.completedTasksCount} مستندات
              </span>
            </div>
          </div>

          {/* Sub-Agent 3: Web & Downloader */}
          <div
            onClick={() => handleAgentClick('web')}
            className={`cursor-pointer rounded-xl p-4 transition-all duration-300 border relative group ${
              activeTab === 'web'
                ? 'bg-gradient-to-b from-violet-950/90 to-slate-900 border-violet-400 shadow-xl shadow-violet-500/25 ring-1 ring-violet-400/50'
                : theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 hover:border-violet-500/70 hover:bg-slate-900'
                : 'bg-slate-50 border-slate-200 hover:border-violet-500 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-400/50 flex items-center justify-center text-violet-400 shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAgentClick('web');
                  }}
                  className="p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/30 text-violet-400 border border-violet-500/40 transition-colors"
                  title="استمع إلى تعريف وكيل الإنترنت بنفسه"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                {getStatusBadge(agents.web?.status)}
              </div>
            </div>

            <h4 className="font-bold text-sm truncate">{agents.web?.nameAr}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
              بحث جوجل المباشر، تصفح المواقع، واستخراج البيانات ومدير التحميل
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-violet-400">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                تصفح + تنزيل
              </span>
              <span className="font-mono text-violet-400 font-semibold">
                {agents.web?.completedTasksCount} عمليات
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
