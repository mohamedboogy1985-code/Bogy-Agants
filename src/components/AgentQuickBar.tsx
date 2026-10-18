import React from 'react';
import { Layers, Bot, Terminal, FileSpreadsheet, Globe, TrendingUp } from 'lucide-react';
import { AgentId } from '../types/agent';

export type MainViewTab = 'swarm' | 'analytics' | AgentId;

interface AgentQuickBarProps {
  activeTab: MainViewTab;
  onTabChange: (tab: MainViewTab) => void;
  unseenCounts?: Record<string, number>;
}

export const AgentQuickBar: React.FC<AgentQuickBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const TABS: { id: MainViewTab; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'swarm',
      label: 'نظرة عامة لسرب بوجي (Swarm Overview)',
      icon: <Layers className="w-4 h-4" />,
      color: 'border-cyan-500 text-cyan-300',
    },
    {
      id: 'analytics',
      label: 'إحصائيات إنجاز الوكلاء (Analytics)',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'border-amber-500 text-amber-300',
    },
    {
      id: 'master',
      label: 'الوكيل العام (Bogy Prime)',
      icon: <Bot className="w-4 h-4" />,
      color: 'border-cyan-500 text-cyan-300',
    },
    {
      id: 'windows',
      label: 'وكيل نظام ويندوز (Bogy WinSys)',
      icon: <Terminal className="w-4 h-4" />,
      color: 'border-blue-500 text-blue-300',
    },
    {
      id: 'office',
      label: 'وكيل المستندات (Bogy Office)',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      color: 'border-emerald-500 text-emerald-300',
    },
    {
      id: 'web',
      label: 'وكيل الإنترنت والتحميل (Bogy Web)',
      icon: <Globe className="w-4 h-4" />,
      color: 'border-violet-500 text-violet-300',
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800/80">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              isActive
                ? `bg-slate-900 ${tab.color} border-current`
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border-transparent'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
