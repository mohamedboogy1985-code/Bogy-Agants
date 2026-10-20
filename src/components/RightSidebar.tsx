import React from 'react';
import {
  Bot,
  Power,
  Terminal,
  FileSpreadsheet,
  Globe,
  Layers,
  TrendingUp,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Loader2,
  Mic,
  RotateCw,
  Sliders,
} from 'lucide-react';
import { AgentId, AgentInfo } from '../types/agent';
import { MainViewTab } from './AgentQuickBar';

interface RightSidebarProps {
  agents: Record<AgentId, AgentInfo>;
  activeTab: MainViewTab;
  onSelectTab: (tab: MainViewTab) => void;
  onAgentIntroduce: (agentId: AgentId) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  theme: 'dark' | 'light';
  onSimulateBoot: () => void;
  isProcessing: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  agents,
  activeTab,
  onSelectTab,
  onAgentIntroduce,
  isOpen,
  onToggleOpen,
  theme,
  onSimulateBoot,
  isProcessing,
}) => {
  const AGENT_LIST: {
    id: AgentId;
    icon: React.ReactNode;
    color: string;
    bgActive: string;
    borderActive: string;
    textAccent: string;
    pillBg: string;
  }[] = [
    {
      id: 'master',
      icon: <Bot className="w-5 h-5" />,
      color: 'cyan',
      bgActive: theme === 'dark' ? 'bg-cyan-950/80' : 'bg-cyan-50',
      borderActive: 'border-cyan-400',
      textAccent: 'text-cyan-400',
      pillBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'startup',
      icon: <Power className="w-5 h-5" />,
      color: 'amber',
      bgActive: theme === 'dark' ? 'bg-amber-950/80' : 'bg-amber-50',
      borderActive: 'border-amber-400',
      textAccent: 'text-amber-400',
      pillBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      id: 'windows',
      icon: <Terminal className="w-5 h-5" />,
      color: 'blue',
      bgActive: theme === 'dark' ? 'bg-blue-950/80' : 'bg-blue-50',
      borderActive: 'border-blue-400',
      textAccent: 'text-blue-400',
      pillBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    {
      id: 'office',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      color: 'emerald',
      bgActive: theme === 'dark' ? 'bg-emerald-950/80' : 'bg-emerald-50',
      borderActive: 'border-emerald-400',
      textAccent: 'text-emerald-400',
      pillBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'web',
      icon: <Globe className="w-5 h-5" />,
      color: 'violet',
      bgActive: theme === 'dark' ? 'bg-violet-950/80' : 'bg-violet-50',
      borderActive: 'border-violet-400',
      textAccent: 'text-violet-400',
      pillBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    },
  ];

  const getStatusDot = (status: AgentInfo['status']) => {
    switch (status) {
      case 'executing':
        return <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />;
      case 'listening':
        return <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />;
      case 'completed':
        return <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
      default:
        return <span className="w-2 h-2 rounded-full bg-emerald-500" />;
    }
  };

  const handleCardClick = (id: AgentId) => {
    onSelectTab(id);
    onAgentIntroduce(id);
  };

  return (
    <aside
      className={`shrink-0 transition-all duration-300 z-40 border-l relative flex flex-col ${
        isOpen ? 'w-72 lg:w-80' : 'w-16'
      } ${
        theme === 'dark'
          ? 'bg-slate-950/95 border-slate-800 text-slate-100 backdrop-blur-xl'
          : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-xl shadow-lg'
      }`}
    >
      {/* Sidebar Header */}
      <div
        className={`h-16 px-3.5 flex items-center justify-between border-b ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        {isOpen ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Zap className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-xs bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                وكلاء بوجي (AGENTS)
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">سرب الذكاء الاصطناعي</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleOpen}
          className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          title={isOpen ? 'طي الشريط الجانبي' : 'توسيع الشريط الجانبي'}
        >
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
        {isOpen && (
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              قائمة الوكلاء الخمسة:
            </span>
            <span className="text-[10px] text-cyan-400 font-medium">اضغط للتعريف</span>
          </div>
        )}

        {AGENT_LIST.map((item) => {
          const agent = agents[item.id];
          if (!agent) return null;
          const isActive = activeTab === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.id)}
              className={`rounded-xl border transition-all cursor-pointer relative group ${
                isOpen ? 'p-3' : 'p-2 flex justify-center'
              } ${
                isActive
                  ? `${item.bgActive} ${item.borderActive} shadow-md`
                  : theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
              title={!isOpen ? `${agent.nameAr} - اضغط للتعريف الصوتي` : undefined}
            >
              {isOpen ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                          isActive
                            ? 'bg-cyan-500 text-white border-cyan-400'
                            : theme === 'dark'
                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="truncate">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isActive
                              ? item.textAccent
                              : theme === 'dark'
                              ? 'text-slate-100'
                              : 'text-slate-800'
                          }`}
                        >
                          {agent.nameAr}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {agent.name}
                        </p>
                      </div>
                    </div>

                    {/* Self-Introduce Voice Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAgentIntroduce(item.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/50'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50'
                      }`}
                      title="استمع إلى تعريف هذا الوكيل بنفسه"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card bottom info */}
                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/40">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      {getStatusDot(agent.status)}
                      <span className="truncate">
                        {agent.status === 'executing'
                          ? 'قيد التنفيذ...'
                          : agent.status === 'planning'
                          ? 'تخطيط'
                          : 'متاح ونشط'}
                      </span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border font-mono font-semibold ${item.pillBg}`}>
                      {agent.completedTasksCount} مهام
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-cyan-500 text-white'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    {getStatusDot(agent.status)}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Navigation Quick Links */}
        {isOpen && (
          <div className="pt-3 border-t border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 px-1 mb-1 block">
              طرق العرض الرئيسية:
            </span>

            {/* Swarm Link */}
            <button
              onClick={() => onSelectTab('swarm')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'swarm'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>لوحة السرب الشاملة (Swarm OS)</span>
            </button>

            {/* Analytics Link */}
            <button
              onClick={() => onSelectTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>إحصائيات الإنجاز (Recharts)</span>
            </button>

            {/* Adapters & Security Link */}
            <button
              onClick={() => onSelectTab('adapters')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'adapters'
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>أدوات التحكم وجدار الحماية (Adapters 🛡️)</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer of Sidebar: Quick PC Reboot / Auto-Boot trigger */}
      <div
        className={`p-3 border-t ${
          theme === 'dark' ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
        }`}
      >
        {isOpen ? (
          <button
            onClick={onSimulateBoot}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            title="محاكاة إقلاع الكمبيوتر واختبار الترحيب التلقائي"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>محاكاة إقلاع الكمبيوتر 🔄</span>
          </button>
        ) : (
          <button
            onClick={onSimulateBoot}
            disabled={isProcessing}
            className="w-10 h-10 mx-auto rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center cursor-pointer shadow-md"
            title="محاكاة إقلاع الكمبيوتر 🔄"
          >
            <RotateCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
    </aside>
  );
};
