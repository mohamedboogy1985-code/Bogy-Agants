import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, Zap, Clock, ShieldCheck, Activity } from 'lucide-react';
import { AgentId, AgentInfo } from '../types/agent';

export interface HourlyAgentActivity {
  hour: string;
  master: number;
  windows: number;
  office: number;
  web: number;
  total: number;
}

interface AgentActivityAnalyticsProps {
  agents: Record<AgentId, AgentInfo>;
  hourlyActivity: HourlyAgentActivity[];
}

export const AgentActivityAnalytics: React.FC<AgentActivityAnalyticsProps> = ({
  agents,
  hourlyActivity,
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Compute summary metrics
  const totalCompletedToday = Object.values(agents).reduce(
    (acc, curr) => acc + curr.completedTasksCount,
    0
  );

  const mostActive = Object.values(agents).reduce((prev, current) =>
    prev.completedTasksCount > current.completedTasksCount ? prev : current
  );

  // Custom Dark Cyber Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-cyan-800/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              الوقت: {label}
            </span>
            <span className="text-[10px] text-slate-400">سجل الإنجاز</span>
          </div>

          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const nameMap: Record<string, string> = {
                master: 'الوكيل العام',
                windows: 'وكيل ويندوز',
                office: 'وكيل المستندات',
                web: 'وكيل الإنترنت',
              };
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    {nameMap[entry.dataKey] || entry.name}:
                  </span>
                  <span className="font-bold text-slate-100">{entry.value} مهام</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/90 p-5 shadow-2xl backdrop-blur-md space-y-5">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                مخطط المهام المكتملة لكل وكيل على مدار اليوم (Recharts Analytics)
              </h3>
              <p className="text-xs text-slate-400">
                رصد بياني فوري لحجم الإنتاجية وتوزيع العمليات المنفذة بين الوكلاء بالساعة
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl p-1 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              chartType === 'area'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>المخطط المساحي الزمني</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              chartType === 'bar'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>مخطط الأعمدة المقارن</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">إجمالي المنجز اليوم</span>
            <div className="text-lg font-bold font-mono text-cyan-400">{totalCompletedToday} مهمة</div>
            <span className="text-[10px] text-emerald-400 font-mono">100% نجاح بدون أخطاء</span>
          </div>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">الوكيل الأكثر نشاطاً</span>
            <div className="text-sm font-bold text-slate-200 truncate max-w-[110px]">{mostActive.nameAr}</div>
            <span className="text-[10px] text-cyan-400 font-mono">{mostActive.completedTasksCount} مهام منجزة</span>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">معدل سرعة الإنجاز</span>
            <div className="text-lg font-bold font-mono text-emerald-400">0.8 ثانية</div>
            <span className="text-[10px] text-slate-500 font-mono">تزامن فوري متوازي</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">كفاءة سرب الوكلاء</span>
            <div className="text-lg font-bold font-mono text-violet-400">99.8%</div>
            <span className="text-[10px] text-slate-500 font-mono">تنسيق وتوجيه ذكي</span>
          </div>
          <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Recharts Visual Display */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={hourlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMaster" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorWindows" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOffice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  const map: Record<string, string> = {
                    master: 'الوكيل العام',
                    windows: 'وكيل ويندوز',
                    office: 'وكيل المستندات',
                    web: 'وكيل الإنترنت',
                  };
                  return <span className="text-slate-300 text-xs font-semibold mr-1">{map[value] || value}</span>;
                }}
              />

              <Area
                type="monotone"
                dataKey="master"
                name="master"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMaster)"
              />
              <Area
                type="monotone"
                dataKey="windows"
                name="windows"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWindows)"
              />
              <Area
                type="monotone"
                dataKey="office"
                name="office"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOffice)"
              />
              <Area
                type="monotone"
                dataKey="web"
                name="web"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWeb)"
              />
            </AreaChart>
          ) : (
            <BarChart data={hourlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  const map: Record<string, string> = {
                    master: 'الوكيل العام',
                    windows: 'وكيل ويندوز',
                    office: 'وكيل المستندات',
                    web: 'وكيل الإنترنت',
                  };
                  return <span className="text-slate-300 text-xs font-semibold mr-1">{map[value] || value}</span>;
                }}
              />
              <Bar dataKey="master" name="master" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="windows" name="windows" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="office" name="office" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="web" name="web" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Agent Activity Badges Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
        <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between">
          <span className="text-cyan-300 font-medium">الوكيل العام:</span>
          <span className="font-mono font-bold text-cyan-400">{agents.master.completedTasksCount} مهمة</span>
        </div>
        <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-800/40 flex items-center justify-between">
          <span className="text-blue-300 font-medium">وكيل ويندوز:</span>
          <span className="font-mono font-bold text-blue-400">{agents.windows.completedTasksCount} مهمة</span>
        </div>
        <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between">
          <span className="text-emerald-300 font-medium">وكيل المستندات:</span>
          <span className="font-mono font-bold text-emerald-400">{agents.office.completedTasksCount} مستند</span>
        </div>
        <div className="p-2 rounded-lg bg-violet-950/30 border border-violet-800/40 flex items-center justify-between">
          <span className="text-violet-300 font-medium">وكيل الإنترنت:</span>
          <span className="font-mono font-bold text-violet-400">{agents.web.completedTasksCount} عملية</span>
        </div>
      </div>
    </div>
  );
};
