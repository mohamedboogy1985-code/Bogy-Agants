import React, { useState } from 'react';
import { Terminal as TerminalIcon, Play, Download, Copy, Check, Cpu, HardDrive, Wifi, Activity, Trash2, RefreshCw } from 'lucide-react';
import { WindowsCommandLog, WindowsProcess } from '../types/agent';
import { FileExportService } from '../services/fileExportService';

interface WindowsAgentViewProps {
  logs: WindowsCommandLog[];
  onExecuteCustomCommand: (cmd: string) => void;
  isExecuting: boolean;
  generatedScript: string;
}

export const WindowsAgentView: React.FC<WindowsAgentViewProps> = ({
  logs,
  onExecuteCustomCommand,
  isExecuting,
  generatedScript,
}) => {
  const [customCmd, setCustomCmd] = useState('');
  const [copied, setCopied] = useState(false);
  const [processes, setProcesses] = useState<WindowsProcess[]>([
    { pid: 4820, name: 'powershell.exe', cpu: 2.4, ramMb: 85, status: 'Running' },
    { pid: 1044, name: 'explorer.exe', cpu: 1.1, ramMb: 142, status: 'Running' },
    { pid: 7292, name: 'excel.exe', cpu: 0.8, ramMb: 210, status: 'Running' },
    { pid: 3180, name: 'svchost.exe', cpu: 0.2, ramMb: 48, status: 'Running' },
    { pid: 9144, name: 'msedge.exe', cpu: 3.5, ramMb: 320, status: 'Running' },
    { pid: 6028, name: 'System Idle Process', cpu: 89.2, ramMb: 8, status: 'Running' },
  ]);

  const QUICK_COMMANDS = [
    { label: 'فحص العمليات النشطة', cmd: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 6' },
    { label: 'حالة محركات الأقراص C: و D:', cmd: 'Get-Volume | Format-Table DriveLetter, FileSystemLabel, SizeRemaining, Size' },
    { label: 'فحص خدمات النظام', cmd: 'Get-Service | Where-Object Status -eq "Running" | Select-Object -First 5' },
    { label: 'تنظيف الملفات المؤقتة', cmd: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue' },
    { label: 'معلومات النظام والمواصفات', cmd: 'Get-ComputerInfo | Select-Object WindowsProductName, OsArchitecture, CsTotalPhysicalMemory' },
  ];

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCmd.trim() && !isExecuting) {
      onExecuteCustomCommand(customCmd.trim());
      setCustomCmd('');
    }
  };

  const handleCopyScript = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadScript = () => {
    if (generatedScript) {
      FileExportService.exportScript(generatedScript, 'Bogy_Windows_Automation.ps1');
    }
  };

  const handleKillProcess = (pid: number) => {
    setProcesses(processes.filter((p) => p.pid !== pid));
  };

  return (
    <div className="space-y-5">
      {/* Windows Health & Hardware Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">المعالج CPU</span>
            <div className="text-lg font-bold font-mono text-cyan-400">18.4%</div>
            <span className="text-[10px] text-slate-500 font-mono">AMD Ryzen 9 / 16 Cores</span>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">الذاكرة العشوائية RAM</span>
            <div className="text-lg font-bold font-mono text-blue-400">5.8 / 16.0 GB</div>
            <span className="text-[10px] text-slate-500 font-mono">DDR5 5600MHz</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">القرص المحلي (C:)</span>
            <div className="text-lg font-bold font-mono text-emerald-400">312 GB فارغ</div>
            <span className="text-[10px] text-slate-500 font-mono">NVMe SSD 1TB</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">حالة الاتصال والشبكة</span>
            <div className="text-lg font-bold font-mono text-violet-400">1 Gbps Full</div>
            <span className="text-[10px] text-slate-500 font-mono">IPv4: 192.168.1.105</span>
          </div>
          <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400">
            <Wifi className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Windows Terminal */}
      <div className="rounded-xl bg-slate-950 border border-blue-900/40 shadow-2xl overflow-hidden font-mono">
        {/* Terminal Header Bar */}
        <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-blue-400" />
            <span className="text-slate-200 font-semibold">
              Windows PowerShell - Administrator (Bogy WinSys Agent Host)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
            <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          </div>
        </div>

        {/* Terminal Content Screen */}
        <div className="p-4 text-xs space-y-3 min-h-[220px] max-h-[340px] overflow-y-auto ltr text-left bg-[#0c1017]">
          <div className="text-slate-500">
            Windows PowerShell<br />
            Copyright (C) Microsoft Corporation. All rights reserved.<br />
            Bogy Agents AI WinSys Executive Environment Initialized [PID 2840]
          </div>

          {logs.map((log) => (
            <div key={log.id} className="space-y-1">
              <div className="flex items-center gap-1 text-cyan-300">
                <span className="text-blue-400 font-bold">PS C:\Users\NexusAdmin&gt;</span>
                <span>{log.command}</span>
              </div>
              <pre className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                {log.output}
              </pre>
            </div>
          ))}

          {isExecuting && (
            <div className="text-amber-400 animate-pulse flex items-center gap-2">
              <span>PS C:\Users\NexusAdmin&gt; جاري تنفيذ الأمر ومحاكاة مخرجات ويندوز...</span>
            </div>
          )}
        </div>

        {/* Terminal Input Bar */}
        <form onSubmit={handleRunCommand} className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
          <span className="text-xs text-blue-400 font-bold ltr hidden sm:inline">PS C:\&gt;</span>
          <input
            type="text"
            value={customCmd}
            onChange={(e) => setCustomCmd(e.target.value)}
            placeholder="اكتب أمر PowerShell أو CMD لتنفيذه مباشرة على ويندوز..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
            disabled={isExecuting}
          />
          <button
            type="submit"
            disabled={!customCmd.trim() || isExecuting}
            className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 text-xs flex items-center gap-1 cursor-pointer font-sans"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>تنفيذ</span>
          </button>
        </form>
      </div>

      {/* Suggested Quick Commands */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-400 font-medium">أوامر سريعة للوكيل:</span>
        {QUICK_COMMANDS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onExecuteCustomCommand(q.cmd)}
            disabled={isExecuting}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/60 text-slate-300 hover:text-blue-300 text-[11px] transition-colors cursor-pointer"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Generated Script Exporter & Process Manager Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Generated PowerShell Script Block */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <TerminalIcon className="w-4 h-4 text-blue-400" />
                السكربت المؤتمت المولد (.ps1 / .bat)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyScript}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  title="نسخ الكود"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                </button>
                <button
                  onClick={handleDownloadScript}
                  className="px-2.5 py-1 rounded bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/50 text-blue-300 text-[11px] flex items-center gap-1 cursor-pointer font-bold"
                  title="تنزيل كملف سكربت حقيقي لجهازك"
                >
                  <Download className="w-3 h-3" />
                  <span>تنزيل السكربت</span>
                </button>
              </div>
            </div>

            <pre className="text-[11px] font-mono text-cyan-200 bg-slate-950 p-3 rounded-lg border border-slate-800/80 overflow-x-auto max-h-44 leading-relaxed ltr text-left">
              {generatedScript || `# PowerShell Script Auto-Generated by Bogy WinSys Agent\nWrite-Host "Bogy System Automation Active"\nGet-Process | Select-Object -First 5`}
            </pre>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            يمكنك تشغيل هذا السكربت مباشرة داخل موجه أوامر ويندوز عبر الضغط بزر الفأرة الأيمن &gt; Run with PowerShell.
          </p>
        </div>

        {/* Live Process Manager (Task Manager) */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              مدير مهام ويندوز المباشر (Task Manager)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {processes.length} عمليات نشطة
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                  <th className="py-1 px-2">PID</th>
                  <th className="py-1 px-2">اسم العملية</th>
                  <th className="py-1 px-2">CPU</th>
                  <th className="py-1 px-2">RAM</th>
                  <th className="py-1 px-2 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {processes.map((p) => (
                  <tr key={p.pid} className="hover:bg-slate-800/40 text-slate-300">
                    <td className="py-1.5 px-2 text-slate-500">{p.pid}</td>
                    <td className="py-1.5 px-2 font-semibold text-slate-200">{p.name}</td>
                    <td className="py-1.5 px-2 text-cyan-400">{p.cpu}%</td>
                    <td className="py-1.5 px-2 text-slate-400">{p.ramMb} MB</td>
                    <td className="py-1.5 px-2 text-center">
                      <button
                        onClick={() => handleKillProcess(p.pid)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/40 p-1 rounded transition-colors"
                        title="إنهاء المهمة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
