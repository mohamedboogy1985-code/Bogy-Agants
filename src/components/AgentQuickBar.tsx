import React from 'react';
import { Layers, Bot, Power, Terminal, FileSpreadsheet, Globe, TrendingUp, Sliders } from 'lucide-react';
import { AgentId } from '../types/agent';

export type MainViewTab = 'swarm' | 'analytics' | 'adapters' | AgentId;

interface AgentQuickBarProps {
  activeTab: MainViewTab;
  onTabChange: (tab: MainViewTab) => void;
  theme?: 'dark' | 'light';
}

export const AgentQuickBar: React.FC<AgentQuickBarProps> = ({
  activeTab,
  onTabChange,
  theme = 'dark',
}) => {
  const TABS: { id: MainViewTab; label: string; icon: React.ReactNode; activeColor: string }[] = [
    {
      id: 'swarm',
      label: 'نظرة عامة لسرب بوجي (Swarm)',
      icon: <Layers className="w-4 h-4" />,
      activeColor: 'border-cyan-500 text-cyan-400',
    },
    {
      id: 'adapters',
      label: 'أدوات التحكم وجدار الحماية (Adapters 🛡️)',
      icon: <Sliders className="w-4 h-4" />,
      activeColor: 'border-indigo-500 text-indigo-400',
    },
    {
      id: 'startup',
      label: 'وكيل بدء التشغيل (Bogy Boot ⚡)',
      icon: <Power className="w-4 h-4" />,
      activeColor: 'border-amber-500 text-amber-400',
    },
    {
      id: 'master',
      label: 'الوكيل العام (Bogy Prime)',
      icon: <Bot className="w-4 h-4" />,
      activeColor: 'border-cyan-500 text-cyan-400',
    },
    {
      id: 'windows',
      label: 'وكيل ويندوز (Bogy WinSys)',
      icon: <Terminal className="w-4 h-4" />,
      activeColor: 'border-blue-500 text-blue-400',
    },
    {
      id: 'office',
      label: 'وكيل المستندات (Bogy Office)',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      activeColor: 'border-emerald-500 text-emerald-400',
    },
    {
      id: 'web',
      label: 'وكيل الويب والتحميل (Bogy Web)',
      icon: <Globe className="w-4 h-4" />,
      activeColor: 'border-violet-500 text-violet-400',
    },
    {
      id: 'analytics',
      label: 'إحصائيات الإنجاز (Analytics)',
      icon: <TrendingUp className="w-4 h-4" />,
      activeColor: 'border-amber-500 text-amber-400',
    },
  ];

  return (
    <div
      className={`flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b ${
        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
      }`}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              isActive
                ? `${tab.activeColor} border-current ${theme === 'dark' ? 'bg-slate-900/90' : 'bg-slate-100'}`
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border-transparent'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
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
