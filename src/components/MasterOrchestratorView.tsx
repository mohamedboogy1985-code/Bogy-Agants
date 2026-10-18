import React from 'react';
import { Bot, Play, Volume2, ArrowRight, CheckCircle2, Clock, Terminal, FileSpreadsheet, Globe, MessageSquare } from 'lucide-react';
import { OrchestrationResult, AgentMessage, AgentId } from '../types/agent';

interface MasterOrchestratorViewProps {
  currentPlan: OrchestrationResult | null;
  messages: AgentMessage[];
  isProcessing: boolean;
  onReplaySpeech: (text: string) => void;
  onSelectAgentTab: (id: AgentId) => void;
}

export const MasterOrchestratorView: React.FC<MasterOrchestratorViewProps> = ({
  currentPlan,
  messages,
  isProcessing,
  onReplaySpeech,
  onSelectAgentTab,
}) => {
  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case 'windows':
        return <Terminal className="w-4 h-4 text-blue-400" />;
      case 'office':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'web':
        return <Globe className="w-4 h-4 text-violet-400" />;
      default:
        return <Bot className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getAgentLabel = (id: AgentId) => {
    switch (id) {
      case 'windows':
        return 'وكيل ويندوز';
      case 'office':
        return 'وكيل المستندات';
      case 'web':
        return 'وكيل الإنترنت';
      default:
        return 'الوكيل العام';
    }
  };

  return (
    <div className="space-y-5">
      {/* Current Active Plan Section */}
      {currentPlan && (
        <div className="rounded-xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-800/60 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3 border-b border-cyan-900/50 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Bot className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">
                  خطة التنسيق المشتركة المعتمدة (Orchestration Plan)
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  تحليل الوكيل العام وتوزيع الصلاحيات
                </p>
              </div>
            </div>

            {currentPlan.speechResponse && (
              <button
                onClick={() => onReplaySpeech(currentPlan.speechResponse)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/50 text-xs transition-colors cursor-pointer"
                title="استمع للرد الصوتي مجدداً"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>إعادة الاستماع</span>
              </button>
            )}
          </div>

          {/* Plan Summary */}
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800 mb-4">
            {currentPlan.planSummary}
          </p>

          {/* Sub-agent Tasks Cards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              المهام الموكلة للوكلاء التنفيذيين:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentPlan.delegatedTasks.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectAgentTab(t.agentId)}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                        {getAgentIcon(t.agentId)}
                        {getAgentLabel(t.agentId)}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        مكتمل
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 mb-1">{t.taskTitle}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{t.instruction}</p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                    <span>{t.expectedArtifact || 'عرض النتائج'}</span>
                    <ArrowRight className="w-3 h-3 rtl:rotate-180 text-cyan-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages / Dialogue History Feed */}
      <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">سجل الأوامر وتفاعلات الوكلاء</h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              لا توجد أوامر بعد. اضغط زر الميكروفون بالأعلى وتحدث بأي طلب وسيقوم الوكيل العام بتنفيذه وتوزيعه.
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.senderId === 'user';
              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-800/80 border-slate-700 text-slate-100 mr-8'
                      : 'bg-cyan-950/40 border-cyan-800/50 text-slate-200 ml-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold flex items-center gap-1.5">
                      {isUser ? (
                        <span className="text-amber-400">المستخدم (أمر صوتي/نصي)</span>
                      ) : (
                        <>
                          <Bot className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-cyan-300">{m.senderName}</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{m.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
