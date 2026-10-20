import React, { useState, useEffect, useRef } from 'react';
import {
  MousePointer,
  Keyboard,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Terminal,
  Play,
  RotateCw,
  Download,
  Copy,
  Check,
  Sliders,
  Settings,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Eye,
  FileCode,
  Zap,
} from 'lucide-react';
import {
  MouseActionType,
  KeyboardActionType,
  BrowserConfig,
  SecurityPolicyConfig,
  SecurityAuditItem,
  OllamaConfig,
  OllamaModelOption,
} from '../types/agent';
import { SecurityGuardrails } from '../services/securityGuardrails';
import { FileExportService } from '../services/fileExportService';

interface SystemControlAdapterViewProps {
  theme?: 'dark' | 'light';
  onExecuteAgentTask?: (prompt: string) => void;
}

export const SystemControlAdapterView: React.FC<SystemControlAdapterViewProps> = ({
  theme = 'dark',
  onExecuteAgentTask,
}) => {
  const [activeTab, setActiveTab] = useState<'mouse_keyboard' | 'browser' | 'security' | 'ollama'>('security');

  // 1. Mouse & Keyboard State
  const [cursorPos, setCursorPos] = useState({ x: 960, y: 540 });
  const [typeText, setTypeText] = useState('Bogy Agents AI Automated Input');
  const [lastActionStatus, setLastActionStatus] = useState<string | null>(null);
  const [actionScript, setActionScript] = useState<string>('');
  const [isExecutingAction, setIsExecutingAction] = useState(false);

  // 2. Browser Automation Config & State
  const [browserConfig, setBrowserConfig] = useState<BrowserConfig>({
    headless: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 BogyAutomation/2.0',
    javascriptEnabled: true,
    allowDownloads: true,
    blockAdsAndTrackers: true,
  });
  const [targetBrowserUrl, setTargetBrowserUrl] = useState('https://www.google.com');
  const [targetSelector, setTargetSelector] = useState('input[name="q"]');
  const [browserInputText, setBrowserInputText] = useState('Bogy Agents AI Swarm');
  const [browserFeedback, setBrowserFeedback] = useState<string | null>(null);

  // 3. Security Guardrails Policy
  const [policy, setPolicy] = useState<SecurityPolicyConfig>(SecurityGuardrails.defaultPolicy);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditItem[]>([
    {
      id: 'log-1',
      timestamp: '11:02:14',
      adapter: 'windows',
      action: 'Diagnostics Query',
      target: 'systeminformation / OS kernel',
      riskLevel: 'low',
      status: 'allowed',
      reason: 'استعلام تشخيصي غير مدمر ومصرح به',
    },
    {
      id: 'log-2',
      timestamp: '11:04:30',
      adapter: 'browser',
      action: 'browser_navigate',
      target: 'https://news.ycombinator.com',
      riskLevel: 'low',
      status: 'allowed',
      reason: 'تصفح موقع ويب مصرح به ضمن سياسة الأمان',
    },
    {
      id: 'log-3',
      timestamp: '11:08:19',
      adapter: 'windows',
      action: 'Format Disk Attempt',
      target: 'format C: /fs:NTFS',
      riskLevel: 'blocked',
      status: 'blocked',
      reason: 'تم حظر محاولة تهيئة القرص لحماية النظام (Blocked by Guardrails)',
    },
  ]);

  // 4. Ollama Local Agent Config
  const [ollamaConfig, setOllamaConfig] = useState<OllamaConfig>({
    host: 'http://localhost:11434',
    selectedModel: 'llama3.2',
    temperature: 0.2,
    isConnected: false,
    systemPrompt:
      'أنت وكيل بوجي الذكي لأتمتة ويندوز والمتصفح مع التقيد الصارم بسياسات الأمان وحماية ملفات النظام.',
    useOllamaForExecution: false,
  });
  const [ollamaModels, setOllamaModels] = useState<OllamaModelOption[]>([
    { name: 'llama3.2', displayName: 'Llama 3.2 (3B) - خفيف وسريع', size: '2.0 GB', family: 'llama', recommended: true },
    { name: 'qwen2.5:7b', displayName: 'Qwen 2.5 (7B) - ممتاز للمهام البرمجية', size: '4.7 GB', family: 'qwen', recommended: true },
    { name: 'deepseek-r1:8b', displayName: 'DeepSeek R1 (8B) - استدلال عميق', size: '4.9 GB', family: 'deepseek', recommended: true },
    { name: 'mistral:latest', displayName: 'Mistral (7B) - متعدد الاستخدامات', size: '4.1 GB', family: 'mistral', recommended: false },
  ]);
  const [isCheckingOllama, setIsCheckingOllama] = useState(false);
  const [ollamaStatusMsg, setOllamaStatusMsg] = useState<string>('جاهز للفحص');
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Check Ollama status on mount
  useEffect(() => {
    checkOllamaConnection();
    fetchAuditLogs();
  }, []);

  const checkOllamaConnection = async () => {
    setIsCheckingOllama(true);
    try {
      const res = await fetch(`/api/ollama/status?host=${encodeURIComponent(ollamaConfig.host)}`);
      if (res.ok) {
        const data = await res.json();
        setOllamaConfig((prev) => ({ ...prev, isConnected: data.isConnected }));
        if (data.models && data.models.length > 0) {
          setOllamaModels(data.models);
        }
        setOllamaStatusMsg(
          data.isConnected
            ? 'متصل بنجاح بخادم Ollama المحلي 🟢'
            : 'خادم Ollama المحلي غير متصل (يمكن استخدام Gemini أو تشغيل: ollama serve) ⚪'
        );
      }
    } catch {
      setOllamaConfig((prev) => ({ ...prev, isConnected: false }));
      setOllamaStatusMsg('خادم Ollama المحلي غير متاح حالياً.');
    } finally {
      setIsCheckingOllama(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/adapters/security/audit-log');
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setAuditLogs(data.items);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Execute Mouse Action via backend adapter
  const handleMouseAction = async (actionType: MouseActionType, button: 'left' | 'right' | 'middle' = 'left') => {
    // Security check
    const risk = SecurityGuardrails.evaluateRisk(
      'mouse_keyboard',
      `mouse_${actionType}`,
      `(${cursorPos.x}, ${cursorPos.y})`,
      policy
    );

    if (!risk.isAllowed) {
      alert(`⚠️ تم حظر العملية بواسطة سياسة الأمان: ${risk.reason}`);
      return;
    }

    setIsExecutingAction(true);
    try {
      const res = await fetch('/api/adapters/mouse-keyboard/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionCategory: 'mouse',
          actionType,
          x: cursorPos.x,
          y: cursorPos.y,
          button,
          deltaY: actionType === 'scroll' ? 120 : undefined,
        }),
      });
      const data = await res.json();
      setLastActionStatus(data.message || `تم تنفيذ حركة الفأرة (${actionType}) بنجاح.`);
      if (data.script) setActionScript(data.script);
      fetchAuditLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecutingAction(false);
    }
  };

  // Execute Keyboard Action via backend adapter
  const handleKeyboardAction = async (actionType: KeyboardActionType, keyText: string, modifiers: ('ctrl' | 'alt' | 'shift' | 'win')[] = []) => {
    const risk = SecurityGuardrails.evaluateRisk('mouse_keyboard', `keyboard_${actionType}`, keyText, policy);

    if (!risk.isAllowed) {
      alert(`⚠️ تم حظر الإدخال بواسطة جدار الحماية: ${risk.reason}`);
      return;
    }

    setIsExecutingAction(true);
    try {
      const res = await fetch('/api/adapters/mouse-keyboard/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionCategory: 'keyboard',
          actionType,
          text: actionType === 'type' ? keyText : undefined,
          key: actionType !== 'type' ? keyText : undefined,
          modifiers,
        }),
      });
      const data = await res.json();
      if (data.blocked) {
        alert(data.error);
      } else {
        setLastActionStatus(data.message || `تم تنفيذ أمر لوحة المفاتيح [${keyText}] بنجاح.`);
        if (data.script) setActionScript(data.script);
      }
      fetchAuditLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecutingAction(false);
    }
  };

  // Execute Browser Action via adapter
  const handleBrowserAction = async (action: 'navigate' | 'click' | 'type' | 'screenshot' | 'extract') => {
    const risk = SecurityGuardrails.evaluateRisk('browser', action, targetBrowserUrl || targetSelector, policy);
    if (!risk.isAllowed) {
      alert(`تم حظر إجراء المتصفح: ${risk.reason}`);
      return;
    }

    setBrowserFeedback(`جاري تنفيذ إجراء المتصفح: ${action}...`);
    try {
      const res = await fetch('/api/adapters/browser/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          url: targetBrowserUrl,
          selector: targetSelector,
          text: browserInputText,
        }),
      });
      const data = await res.json();
      setBrowserFeedback(data.summary || `اكتمل إجراء المتصفح [${action}] بنجاح.`);
      fetchAuditLogs();
    } catch (e) {
      console.error(e);
      setBrowserFeedback('تعذر إتمام إجراء المتصفح.');
    }
  };

  // Download Modelfile for Ollama
  const handleDownloadModelfile = () => {
    const content = SecurityGuardrails.generateOllamaModelfile(ollamaConfig.selectedModel);
    FileExportService.triggerDownload(content, 'Modelfile', 'text/plain');
  };

  // Copy Tools JSON Schema for Ollama / AutoGen / LangChain
  const handleCopyToolsSchema = () => {
    const schema = JSON.stringify(SecurityGuardrails.getOllamaToolsSchema(), null, 2);
    navigator.clipboard.writeText(schema);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Control Adapters & Security Guardrails Header */}
      <div
        className={`rounded-2xl p-6 border transition-all shadow-xl relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500/40 text-slate-100'
            : 'bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 border-indigo-200 text-slate-900 shadow-indigo-500/5'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                  theme === 'dark' ? 'bg-slate-950 text-indigo-400' : 'bg-white text-indigo-600'
                }`}
              >
                <Sliders className="w-7 h-7" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  مركز تحكم أدوات الفأرة ولوحة المفاتيح والمتصفح مع جدار حماية النظام
                </h2>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  SECURE ADAPTERS & OLLAMA ENGINE 🛡️
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed max-w-3xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                تفعيل الـ Adapters الآمنة للفأرة ولوحة المفاتيح والمتصفح، مع <b>تقييد صلاحيات الـ LLM لحماية النظام والملفات الحساسة</b> ومنع العمليات التدميرية، ودعم الربط بنماذج Ollama المحلية وتصدير مواصفات استدعاء الأدوات (Tool Calling).
              </p>
            </div>
          </div>

          {/* Quick Security Status Badge */}
          <div
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 shrink-0 ${
              policy.level === 'strict'
                ? theme === 'dark'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs font-bold font-mono">وضع الحماية الصارم (Strict Guardrails)</div>
              <div className="text-[10px] text-slate-400">الملفات الحساسة ومسارات ويندوز محمية 100%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        className={`flex items-center gap-2 border-b pb-1 overflow-x-auto scrollbar-none ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>جدار الحماية وصلاحيات الـ LLM (Guardrails & Audit)</span>
        </button>

        <button
          onClick={() => setActiveTab('mouse_keyboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'mouse_keyboard'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <MousePointer className="w-4 h-4" />
          <span>أدوات الفأرة ولوحة المفاتيح (Mouse & Keyboard)</span>
        </button>

        <button
          onClick={() => setActiveTab('browser')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'browser'
              ? 'border-violet-500 text-violet-400 bg-violet-500/10'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>التحكم المتقدم بالمتصفح وتهيئته (Browser Automation)</span>
        </button>

        <button
          onClick={() => setActiveTab('ollama')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'ollama'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>ربط Ollama واستدعاء الأدوات (Local LLM Studio)</span>
        </button>
      </div>

      {/* TAB 1: SECURITY GUARDRAILS & PERMISSIONS MANAGER */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          {/* Permissions Controls Grid */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                  سياسة الصلاحيات وحماية نظام ويندوز (Permission Guardrails)
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  تحديد سقف الصلاحيات الممنوحة لنموذج الذكاء الاصطناعي لمنع المساس بملفات النظام الحساسة
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                Anti-Destructive Lock Active 🔒
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Strict Level */}
              <div
                onClick={() => setPolicy((p) => ({ ...p, level: 'strict' }))}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  policy.level === 'strict'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                    : theme === 'dark'
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold">الحماية الصارمة (موصى بها)</span>
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  حظر كامل لأي أمر تدميري (format, del, reg delete) وحماية تامة لمجلدات System32.
                </p>
              </div>

              {/* Option 2: Human Confirmation Gate */}
              <div
                onClick={() =>
                  setPolicy((p) => ({
                    ...p,
                    requireHumanConfirmationForDestructive: !p.requireHumanConfirmationForDestructive,
                  }))
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  policy.requireHumanConfirmationForDestructive
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                    : theme === 'dark'
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold">طلب تأكيد المستخدم (Human Gate)</span>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  طلب إذن المستخدم صراحة قبل تشغيل أي أمر يقوم بتعديل إعدادات أو برامج في النظام.
                </p>
              </div>

              {/* Option 3: Rate Limiting */}
              <div
                className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    محدد سرعة العمليات (Rate Limiting)
                  </span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  الحد الأقصى: <b>{policy.maxActionsPerMinute} عملية/دقيقة</b> لمنع استنزاف موارد المعالج.
                </p>
              </div>
            </div>
          </div>

          {/* Blocked Patterns Showcase */}
          <div
            className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4" />
              الأنماط والمسارات المحظورة تلقائياً من التنفيذ بواسطة الذكاء الاصطناعي:
            </h4>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              {policy.blockedPatterns.map((pat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20"
                >
                  ⛔ {pat}
                </span>
              ))}
            </div>
          </div>

          {/* Live Security Audit Log */}
          <div
            className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                سجل تدقيق الأمان الفوري (Live Security Audit Log)
              </h4>
              <button
                onClick={fetchAuditLogs}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>تحديث السجل</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-mono">
                    <th className="py-1.5 px-2">الوقت</th>
                    <th className="py-1.5 px-2">الـ Adapter</th>
                    <th className="py-1.5 px-2">الإجراء المطلوب</th>
                    <th className="py-1.5 px-2">المسار / الهدف</th>
                    <th className="py-1.5 px-2">مستوى الخطورة</th>
                    <th className="py-1.5 px-2">قرار الحماية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {auditLogs.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-850/40 text-slate-300">
                      <td className="py-2 px-2 text-slate-400">{item.timestamp}</td>
                      <td className="py-2 px-2 font-semibold text-cyan-400">{item.adapter}</td>
                      <td className="py-2 px-2">{item.action}</td>
                      <td className="py-2 px-2 truncate max-w-[180px]">{item.target}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            item.riskLevel === 'blocked'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : item.riskLevel === 'high'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {item.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-bold">
                        {item.status === 'blocked' ? (
                          <span className="text-red-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            محظور
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            مصرح به
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MOUSE & KEYBOARD AUTOMATION TOOLS */}
      {activeTab === 'mouse_keyboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Mouse Automation Pad */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-cyan-400" />
                <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                  محاكي ومتحكم الفأرة (Virtual Mouse Control Pad)
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                X: {cursorPos.x} | Y: {cursorPos.y}
              </span>
            </div>

            {/* Virtual Screen Pad Canvas */}
            <div
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const scaleX = 1920 / rect.width;
                const scaleY = 1080 / rect.height;
                const newX = Math.round((e.clientX - rect.left) * scaleX);
                const newY = Math.round((e.clientY - rect.top) * scaleY);
                setCursorPos({ x: newX, y: newY });
              }}
              onClick={() => handleMouseAction('click')}
              className="h-48 w-full rounded-xl bg-slate-950 border border-cyan-800/60 relative cursor-crosshair overflow-hidden flex items-center justify-center shadow-inner group"
            >
              <div className="text-slate-600 text-xs text-center select-none">
                لوحة تحكم الفأرة التفاعلية (1920x1080 Viewport)<br />
                <span className="text-[10px] text-cyan-500">حرك المؤشر واضغط لتنفيذ نقرة حقيقية</span>
              </div>
              {/* Virtual Cursor Icon */}
              <div
                className="absolute w-4 h-4 pointer-events-none transition-all duration-75 text-cyan-400"
                style={{
                  left: `${(cursorPos.x / 1920) * 100}%`,
                  top: `${(cursorPos.y / 1080) * 100}%`,
                }}
              >
                <MousePointer className="w-4 h-4 fill-cyan-400/30" />
              </div>
            </div>

            {/* Mouse Click Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleMouseAction('click', 'left')}
                disabled={isExecutingAction}
                className="px-3 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-500 cursor-pointer shadow-sm active:scale-95"
              >
                نقرة يسار (Left Click)
              </button>

              <button
                onClick={() => handleMouseAction('right_click', 'right')}
                disabled={isExecutingAction}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 cursor-pointer shadow-sm active:scale-95"
              >
                نقرة يمين (Right Click)
              </button>

              <button
                onClick={() => handleMouseAction('double_click', 'left')}
                disabled={isExecutingAction}
                className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 cursor-pointer shadow-sm active:scale-95"
              >
                نقرة مزدوجة (Double)
              </button>

              <button
                onClick={() => handleMouseAction('scroll')}
                disabled={isExecutingAction}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs hover:bg-slate-700 cursor-pointer"
              >
                تمرير (Scroll Wheel)
              </button>
            </div>
          </div>

          {/* Keyboard Automation & Shortcuts */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-indigo-400" />
                <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                  أدوات لوحة المفاتيح واختصارات ويندوز (Keyboard Automation)
                </h3>
              </div>
              <span className="text-xs font-mono text-indigo-400">SendKeys Engine</span>
            </div>

            {/* Safe Text Typing Input */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                النص المطلوب كتابته بأمان في النافذة النشطة:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typeText}
                  onChange={(e) => setTypeText(e.target.value)}
                  className={`flex-1 rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-950 border-slate-800 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                  placeholder="اكتب النص هنا..."
                />
                <button
                  onClick={() => handleKeyboardAction('type', typeText)}
                  disabled={!typeText.trim() || isExecutingAction}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  كتابة النص ⌨️
                </button>
              </div>
            </div>

            {/* Quick Keyboard Shortcuts Chips */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">
                اختصارات سريعة بنقرة واحدة (Windows Shortcuts):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => handleKeyboardAction('shortcut', 'r', ['win'])}
                  className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-mono font-bold cursor-pointer"
                  title="فتح نافذة تشغيل Run"
                >
                  Win + R (تشغيل)
                </button>
                <button
                  onClick={() => handleKeyboardAction('shortcut', 'c', ['ctrl'])}
                  className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-mono font-bold cursor-pointer"
                >
                  Ctrl + C (نسخ)
                </button>
                <button
                  onClick={() => handleKeyboardAction('shortcut', 'v', ['ctrl'])}
                  className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-mono font-bold cursor-pointer"
                >
                  Ctrl + V (لصق)
                </button>
                <button
                  onClick={() => handleKeyboardAction('press', 'Enter')}
                  className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-mono font-bold cursor-pointer"
                >
                  Enter ↵
                </button>
              </div>
            </div>

            {/* Feedback and Script Preview */}
            {lastActionStatus && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                ✅ {lastActionStatus}
              </div>
            )}

            {actionScript && (
              <div>
                <span className="text-[10px] text-slate-400 font-mono block mb-1">
                  كود باورشيل المولد للأتمتة:
                </span>
                <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto ltr text-left">
                  {actionScript}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ADVANCED BROWSER AUTOMATION & CONFIGURATION */}
      {activeTab === 'browser' && (
        <div className="space-y-5">
          {/* Browser Configuration Deck */}
          <div
            className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-400" />
                <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                  تهيئة وإعدادات المتصفح المؤتمت (Browser Configuration)
                </h3>
              </div>
              <span className="text-xs font-mono text-violet-400">Chromium & Cheerio Engine</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Setting 1: Headless Toggle */}
              <div
                onClick={() => setBrowserConfig((c) => ({ ...c, headless: !c.headless }))}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                  theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">الوضع الصامت (Headless)</span>
                  <span className="text-[10px] text-slate-400">
                    {browserConfig.headless ? 'مفعل (بدون واجهة)' : 'معطل (إظهار النافذة)'}
                  </span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                    browserConfig.headless ? 'bg-violet-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      browserConfig.headless ? 'translate-x-[-16px]' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Setting 2: Viewport Size */}
              <div
                className={`p-3.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-xs font-bold block mb-1">أبعاد الشاشة (Viewport)</span>
                <select
                  value={`${browserConfig.viewportWidth}x${browserConfig.viewportHeight}`}
                  onChange={(e) => {
                    const [w, h] = e.target.value.split('x').map(Number);
                    setBrowserConfig((c) => ({ ...c, viewportWidth: w, viewportHeight: h }));
                  }}
                  className={`w-full text-xs rounded-lg p-1.5 border font-mono ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="1920x1080">1920 x 1080 (Desktop FHD)</option>
                  <option value="1366x768">1366 x 768 (Laptop)</option>
                  <option value="390x844">390 x 844 (Mobile)</option>
                </select>
              </div>

              {/* Setting 3: JavaScript Enabled */}
              <div
                onClick={() =>
                  setBrowserConfig((c) => ({ ...c, javascriptEnabled: !c.javascriptEnabled }))
                }
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                  theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">تشغيل JavaScript</span>
                  <span className="text-[10px] text-slate-400">
                    {browserConfig.javascriptEnabled ? 'نشط' : 'معطل للأمان'}
                  </span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                    browserConfig.javascriptEnabled ? 'bg-violet-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      browserConfig.javascriptEnabled ? 'translate-x-[-16px]' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Setting 4: AdBlock & Tracker Protection */}
              <div
                onClick={() =>
                  setBrowserConfig((c) => ({ ...c, blockAdsAndTrackers: !c.blockAdsAndTrackers }))
                }
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                  theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">حظر الإعلانات والتتبع</span>
                  <span className="text-[10px] text-slate-400">حماية تسريع التصفح</span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                    browserConfig.blockAdsAndTrackers ? 'bg-violet-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      browserConfig.blockAdsAndTrackers ? 'translate-x-[-16px]' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Browser Live Automation Actions */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
              إجراءات التفاعل والتحكم بالمتصفح (Browser Interaction Actions)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">رابط الموقع (Navigate URL):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetBrowserUrl}
                    onChange={(e) => setTargetBrowserUrl(e.target.value)}
                    className="flex-1 rounded-xl p-2 text-xs font-mono bg-slate-950 border border-slate-800 text-slate-200"
                  />
                  <button
                    onClick={() => handleBrowserAction('navigate')}
                    className="px-3 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 cursor-pointer"
                  >
                    فتح الرابط
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">عنصر الـ CSS Selector:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetSelector}
                    onChange={(e) => setTargetSelector(e.target.value)}
                    className="flex-1 rounded-xl p-2 text-xs font-mono bg-slate-950 border border-slate-800 text-slate-200"
                  />
                  <button
                    onClick={() => handleBrowserAction('click')}
                    className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 cursor-pointer"
                  >
                    نقر العنصر
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">إدخال نص في الحقل (Type):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={browserInputText}
                    onChange={(e) => setBrowserInputText(e.target.value)}
                    className="flex-1 rounded-xl p-2 text-xs font-mono bg-slate-950 border border-slate-800 text-slate-200"
                  />
                  <button
                    onClick={() => handleBrowserAction('type')}
                    className="px-3 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-500 cursor-pointer"
                  >
                    تعبئة الحقل
                  </button>
                </div>
              </div>
            </div>

            {browserFeedback && (
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs flex items-center justify-between">
                <span>🌐 {browserFeedback}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: OLLAMA LOCAL AGENT & TOOL CALLING STUDIO */}
      {activeTab === 'ollama' && (
        <div className="space-y-5">
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-slate-800">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                    تشغيل العميل الذكي محلياً عبر Ollama (Local LLM Tool Calling)
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    منح العميل الذكي القدرة على استخدام أدوات الفأرة ولوحة المفاتيح والمتصفح عبر Ollama المحلي
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={checkOllamaConnection}
                  disabled={isCheckingOllama}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isCheckingOllama ? 'animate-spin' : ''}`} />
                  <span>فحص اتصال Ollama</span>
                </button>
              </div>
            </div>

            {/* Ollama Host & Model Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">عنوان خادم Ollama (Host URL):</label>
                <input
                  type="text"
                  value={ollamaConfig.host}
                  onChange={(e) => setOllamaConfig((c) => ({ ...c, host: e.target.value }))}
                  className="w-full rounded-xl p-2 text-xs font-mono bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">النموذج المحلي المختار (Model):</label>
                <select
                  value={ollamaConfig.selectedModel}
                  onChange={(e) => setOllamaConfig((c) => ({ ...c, selectedModel: e.target.value }))}
                  className="w-full rounded-xl p-2 text-xs font-mono bg-slate-950 border border-slate-800 text-slate-200"
                >
                  {ollamaModels.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.displayName} ({m.size})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">حالة الاتصال والخدمة:</label>
                <div className="rounded-xl p-2 text-xs bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
                  <span className="truncate">{ollamaStatusMsg}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${ollamaConfig.isConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </div>
              </div>
            </div>

            {/* Export Modelfile & Schema Actions */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-200">
                  ملفات تهيئة Ollama وتصدير مواصفات الأدوات (Tools Schema)
                </h4>
                <p className="text-[11px] text-slate-400">
                  تصدير ملف Modelfile مهيأ بجدار الحماية، أو تصدير مخطط JSON Schema للأدوات لربطه مع Ollama.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleDownloadModelfile}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs hover:from-indigo-500 hover:to-blue-500 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل Modelfile</span>
                </button>

                <button
                  onClick={handleCopyToolsSchema}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'تم النسخ' : 'نسخ Tools Schema'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
