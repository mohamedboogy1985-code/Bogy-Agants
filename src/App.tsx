import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { VoiceController } from './components/VoiceController';
import { AgentSwarmView } from './components/AgentSwarmView';
import { AgentQuickBar, MainViewTab } from './components/AgentQuickBar';
import { MasterOrchestratorView } from './components/MasterOrchestratorView';
import { WindowsAgentView } from './components/WindowsAgentView';
import { OfficeAgentView } from './components/OfficeAgentView';
import { WebAgentView } from './components/WebAgentView';
import { AgentActivityAnalytics, HourlyAgentActivity } from './components/AgentActivityAnalytics';
import { NaturalVoiceStudio } from './components/NaturalVoiceStudio';
import { StartupAgentView } from './components/StartupAgentView';
import { RightSidebar } from './components/RightSidebar';
import { LiveSpeechDisplay } from './components/LiveSpeechDisplay';
import {
  AgentId,
  AgentInfo,
  OrchestrationResult,
  AgentMessage,
  WindowsCommandLog,
  ExcelSheetData,
  WordDocumentData,
  WebSearchResult,
  DownloadItem,
} from './types/agent';
import { voiceService } from './services/voiceService';
import { notificationService } from './services/notificationService';
import { NotificationBanner } from './components/NotificationBanner';

export default function App() {
  // Theme state: Dark Mode / Light Mode with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bogy_theme') as 'dark' | 'light';
      return saved === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  // Right Sidebar Collapsible State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Live Speech Display state (Teleprompter for spoken speech)
  const [spokenText, setSpokenText] = useState(
    'مرحباً بكم ببرنامج وكلاء بوجي! تم إقلاع النظام بنجاح، وسرب الوكلاء الذكي في انتظار أوامرك الصوتية أو النصية.'
  );
  const [activeSpeakerId, setActiveSpeakerId] = useState<AgentId | 'user'>('startup');
  const [activeSpeakerName, setActiveSpeakerName] = useState<string>('وكيل بدء التشغيل (Bogy Boot)');

  // Swarm 5 Agents State: master, startup, windows, office, web
  const [agents, setAgents] = useState<Record<AgentId, AgentInfo>>({
    master: {
      id: 'master',
      name: 'Bogy Prime',
      nameAr: 'الوكيل العام (Bogy Prime)',
      roleAr: 'الموجه الرئيسي لسرب بوجي: استقبال الأوامر الصوتية وتنسيق المهام وتلخيص النتائج',
      color: 'cyan',
      status: 'idle',
      completedTasksCount: 4,
    },
    startup: {
      id: 'startup',
      name: 'Bogy Auto-Boot Agent',
      nameAr: 'وكيل بدء التشغيل (Bogy Boot)',
      roleAr: 'إقلاع النظام: يبدأ فور تشغيل جهاز الكمبيوتر، يرحب تلقائياً ويعرض المساعدة لتنفيذ أي أوامر فوراً',
      color: 'amber',
      status: 'completed',
      completedTasksCount: 5,
    },
    windows: {
      id: 'windows',
      name: 'Bogy WinSys Commander',
      nameAr: 'وكيل نظام ويندوز (Bogy WinSys)',
      roleAr: 'إدارة ويندوز: تنفيذ أوامر PowerShell وCMD، فحص الموارد، وتوليد سكربتات الأتمتة',
      color: 'blue',
      status: 'idle',
      completedTasksCount: 6,
    },
    office: {
      id: 'office',
      name: 'Bogy DocuMaster Office',
      nameAr: 'وكيل المستندات والأوفيس (Bogy Office)',
      roleAr: 'خبير الأوفيس: إنشاء جداول إكسيل بالمعادلات (XLSX) ومستندات وتقارير وورد (DOCX)',
      color: 'emerald',
      status: 'idle',
      completedTasksCount: 5,
    },
    web: {
      id: 'web',
      name: 'Bogy CyberWeb Navigator',
      nameAr: 'وكيل الإنترنت والتحميل (Bogy Web)',
      roleAr: 'خبير الإنترنت: استكشاف الويب والبحث المباشر بجوجل وإدارة تنزيل الملفات',
      color: 'violet',
      status: 'idle',
      completedTasksCount: 8,
    },
  });

  const [activeTab, setActiveTab] = useState<MainViewTab>('swarm');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lang, setLang] = useState('ar-SA');

  // Hourly Completed Tasks Analytics (Recharts dataset including startup agent)
  const [hourlyActivity, setHourlyActivity] = useState<HourlyAgentActivity[]>([
    { hour: '08:00 ص', master: 1, startup: 1, windows: 2, office: 1, web: 2, total: 7 },
    { hour: '10:00 ص', master: 2, startup: 1, windows: 3, office: 2, web: 4, total: 12 },
    { hour: '12:00 م', master: 3, startup: 2, windows: 5, office: 4, web: 6, total: 20 },
    { hour: '02:00 م', master: 2, startup: 1, windows: 4, office: 3, web: 5, total: 15 },
    { hour: '04:00 م', master: 3, startup: 2, windows: 5, office: 4, web: 7, total: 21 },
    { hour: '06:00 م', master: 4, startup: 2, windows: 6, office: 5, web: 8, total: 25 },
    { hour: 'الآن ⚡', master: 4, startup: 3, windows: 6, office: 5, web: 8, total: 26 },
  ]);

  // Multi-Agent Workflow State
  const [currentPlan, setCurrentPlan] = useState<OrchestrationResult | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'boot-msg',
      senderId: 'startup',
      senderName: 'وكيل بدء التشغيل والإقلاع (Bogy Boot)',
      text: 'مرحباً بكم ببرنامج وكلاء بوجي! تم إقلاع النظام التلقائي بنجاح وفحص كافة خدمات ويندوز والذكاء الاصطناعي والأوفيس والإنترنت. أنا جاهز لمساعدتكم في تنفيذ أي أمر ترغبون به على الفور!',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 'welcome-msg',
      senderId: 'master',
      senderName: 'الوكيل العام (Bogy Prime)',
      text: 'أهلاً بكم في منظومة وكلاء بوجي! تحدث بأي أمر تريده صوتياً أو كتابياً، وسأقوم فوراً بتنسيق العمل وتوجيه باقي الوكلاء لتنفيذه بدقة متناهية.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Windows Agent State
  const [windowsLogs, setWindowsLogs] = useState<WindowsCommandLog[]>([
    {
      id: 'log-1',
      timestamp: '10:42:15',
      command: 'Get-ComputerInfo | Select-Object WindowsProductName, OsHardwareAbstractionLayer',
      output: 'WindowsProductName : Windows 11 Pro\nOsHardwareAbstractionLayer : 10.0.22621.1\nStatus: Healthy (Ready for automated operations)',
      status: 'success',
    },
  ]);
  const [generatedScript, setGeneratedScript] = useState<string>(
    `# PowerShell Maintenance & Diagnostic Script
# Generated by Bogy WinSys Commander Agent
Write-Host "--- Initiating System Health Audit ---" -ForegroundColor Cyan
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
Get-Service | Where-Object {$_.Status -eq "Running"} | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "System state: Optimal. All services responding." -ForegroundColor Green`
  );
  const [isWindowsExecuting, setIsWindowsExecuting] = useState(false);

  // Office Agent State (Excel & Word)
  const [excelData, setExcelData] = useState<ExcelSheetData>({
    title: 'تقرير الأداء والمبيعات السنوي لعام 2025',
    sheetName: 'المبيعات والأرباح',
    fileName: 'Bogy_Financial_Report_2025.xlsx',
    headers: ['المعرف', 'اسم المشروع / الخدمة', 'عدد الوحدات', 'سعر الوحدة ($)', 'التكلفة التشغيلية ($)', 'صافي الربح ($)'],
    rows: [
      ['PRJ-101', 'منظومة وكلاء بوجي للذكاء الاصطناعي', 24, 1200, 9500, 19300],
      ['PRJ-102', 'أتمتة البنية التحتية لويندوز سيرفر', 15, 850, 4200, 8550],
      ['PRJ-103', 'لوحات تحكم وتحليل بيانات إكسيل', 40, 320, 3100, 9700],
      ['PRJ-104', 'محرك استخراج بيانات الويب المتقدم', 18, 950, 4800, 12300],
    ],
    summaryRow: ['المجموع الإجمالي', 'إجمالي 4 مشاريع استراتيجية', 97, '—', 21600, 49850],
    formulaDescription: '=SUM(F2:F5) - صافي الأرباح المحققة بعد خصم التكاليف التشغيلية',
  });

  const [wordData, setWordData] = useState<WordDocumentData>({
    title: 'تقرير دراسة وتطبيق منظومة وكلاء بوجي الأذكياء المؤتمتة',
    fileName: 'Bogy_Executive_Summary.docx',
    subtitle: 'وثيقة رسمية للإدارة العليا حول نتائج الأتمتة الميدانية وخطة عام 2025',
    author: 'Bogy Multi-Agent Swarm',
    date: '2025-10-18',
    sections: [
      {
        heading: '1. الملخص التنفيذي لمنظومة وكلاء بوجي',
        content:
          'تم بنجاح تشغيل منظومة وكلاء الذكاء الاصطناعي "Bogy Agents AI" المزودة بالتحكم الصوتي الطبيعي والربط التكاملي بين أنظمة التشغيل، وإدارة الجداول والمستندات، واستكشاف الويب والتحميلات، مما أسهم في رفع الكفاءة بنسبة 350%.',
      },
      {
        heading: '2. نتائج الأتمتة المباشرة لويندوز عبر PowerShell',
        content:
          'أظهر وكيل ويندوز دقة بنسبة 100% في توليد وتنفيذ أوامر PowerShell وCMD، فحص سجلات الأداء، وتنظيف الملفات المؤقتة وإدارة العمليات المجدولة، مما يقلل التدخل البشري اليدوي ويوفر أكثر من 70% من وقت الصيانة.',
      },
      {
        heading: '3. مخرجات وكيل الأوفيس وإدارة جداول إكسيل',
        content:
          'قام وكيل المستندات بتوليد جداول إكسيل متكاملة مع تطبيق معادلات الجمع والنسب وهوامش الربح تلقائياً، مع دعم التصدير المباشر بصيغتي XLSX و CSV، وصياغة هذا التقرير التفصيلي بصيغة DOCX المطابقة لمعايير Microsoft Word.',
      },
      {
        heading: '4. التوصيات والخطوات المستقبلية',
        content:
          'يوصى بالاعتماد الكامل على الأوامر الصوتية للوكيل العام لجدولة التقارير الأسبوعية، وربط مهام تنزيل الويب المؤتمتة بمجلدات العمل المحلية على ويندوز مباشرة.',
      },
    ],
  });
  const [isOfficeGenerating, setIsOfficeGenerating] = useState(false);

  // Web Agent State
  const [webSummary, setWebSummary] = useState(
    'عثر وكيل الإنترنت على أحدث المستجدات في تقنيات وكلاء الذكاء الاصطناعي (AI Agents) وأتمتة أنظمة التشغيل لعام 2025. تبيّن أن المنظومات متعددة الوكلاء القائمة على التوجيه الصوتي تحقق أعلى معدلات إنتاجية في بيئات العمل.'
  );
  const [webSources, setWebSources] = useState<WebSearchResult[]>([
    {
      title: 'Microsoft Learn: PowerShell Automation & Scripting Best Practices',
      url: 'https://learn.microsoft.com/powershell/scripting/overview',
      snippet: 'دليل ميكروسوفت الشامل لأتمتة مهام ويندوز وإدارة الخدمات عن بعد باستخدام سكريبتات باورشيل المتقدمة.',
    },
    {
      title: 'Google DeepMind: Multi-Agent Systems & Tool Orchestration',
      url: 'https://deepmind.google/discover/blog/multi-agent-collaboration/',
      snippet: 'أحدث أبحاث جوجل حول توزيع المهام بين عدة وكلاء ذكاء اصطناعي وتنسيق الأدوات لإنتاج مستندات وتقارير دقيقة.',
    },
    {
      title: 'Data & Financial Modeling in Modern Office Workflows',
      url: 'https://support.microsoft.com/excel-data-analysis',
      snippet: 'أفضل الممارسات لإنشاء جداول الإكسيل الديناميكية والصيغ الحسابية المؤتمتة للتقارير التنفيذية.',
    },
    {
      title: 'AI Web Navigator & Grounded Search Repository',
      url: 'https://github.com/topics/ai-agent-web-scraper',
      snippet: 'مكتبات مفتوحة المصدر للبحث العميق واستخراج البيانات والملفات المؤتمتة عبر الإنترنت.',
    },
  ]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: 'dl-1',
      name: 'Bogy_Financial_Report_2025.xlsx',
      extension: 'xlsx',
      size: '2.4 MB',
      progress: 100,
      speed: '5.2 MB/s',
      status: 'completed',
      description: 'جدول بيانات المبيعات والأرباح المولد آلياً',
      directDownloadContent: 'Bogy Excel Generated Data',
    },
    {
      id: 'dl-2',
      name: 'Windows_Health_Automation.ps1',
      extension: 'ps1',
      size: '18 KB',
      progress: 100,
      speed: 'Completed',
      status: 'completed',
      description: 'سكربت أتمتة ويندوز للصيانة والنسخ الاحتياطي',
      directDownloadContent: generatedScript,
    },
    {
      id: 'dl-3',
      name: 'AI_Agents_Market_Research_2025.pdf',
      extension: 'pdf',
      size: '4.8 MB',
      progress: 100,
      speed: '6.1 MB/s',
      status: 'completed',
      description: 'تقرير بحث الويب حول الذكاء الاصطناعي التوليدي',
      directDownloadContent: 'Comprehensive Market Research on AI Multi-Agent Swarms 2025',
    },
  ]);
  const [isWebSearching, setIsWebSearching] = useState(false);

  // Sync theme changes with HTML document and localStorage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      localStorage.setItem('bogy_theme', theme);
    }
  }, [theme]);

  // Handle Theme Toggle
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Helper to record activity in Recharts
  const recordAgentActivity = (agentId: AgentId) => {
    setHourlyActivity((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      const last = { ...updated[lastIndex] };
      last[agentId] = ((last[agentId] as number) || 0) + 1;
      last.total =
        (last.master || 0) +
        (last.startup || 0) +
        (last.windows || 0) +
        (last.office || 0) +
        (last.web || 0);
      updated[lastIndex] = last;
      return updated;
    });
  };

  // Sync language setting with Voice Service
  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    voiceService.setLanguage(newLang);
  };

  // Auto-Boot simulation on Computer startup or button click
  const handleSimulateBoot = () => {
    setIsProcessing(true);
    voiceService.playTone('activate');
    const bootGreeting =
      'مرحباً بكم في برنامج وكلاء بوجي للذكاء الاصطناعي! تم إقلاع النظام بنجاح، وكيل بدء التشغيل وكافة خدمات ويندوز والأوفيس والويب في أتم الجاهزية وفي انتظار أوامركم!';
    setSpokenText(bootGreeting);
    setActiveSpeakerId('startup');
    setActiveSpeakerName('وكيل بدء التشغيل (Bogy Boot)');

    setTimeout(() => {
      setIsProcessing(false);
      setAgents((prev) => ({
        ...prev,
        startup: {
          ...prev.startup,
          status: 'completed',
          completedTasksCount: prev.startup.completedTasksCount + 1,
        },
      }));
      recordAgentActivity('startup');

      if (!audioMuted) {
        voiceService.speakText(
          bootGreeting,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }

      notificationService.notifyTaskCompletion(
        'وكيل بدء التشغيل (Bogy Boot)',
        'تم إقلاع نظام بوجي بنجاح ⚡',
        'جميع الخدمات والوكلاء في أتم الجاهزية لاستقبال أي أوامر.',
        'startup'
      );

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#06b6d4', '#3b82f6'],
      });
    }, 1200);
  };

  // Start Voice Listening
  const handleStartListening = () => {
    if (audioMuted) {
      setAudioMuted(false);
    }
    voiceService.stopSpeaking();
    setIsSpeaking(false);
    setActiveSpeakerId('user');
    setActiveSpeakerName('صوتك المباشر');

    voiceService.startListening(
      (newTranscript, isFinal) => {
        setTranscript(newTranscript);
        setSpokenText(newTranscript);
        if (isFinal) {
          handleExecuteMultiAgentGoal(newTranscript);
        }
      },
      (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      },
      (listeningState) => {
        setIsListening(listeningState);
      }
    );
  };

  // Stop Voice Listening
  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
    if (transcript.trim()) {
      handleExecuteMultiAgentGoal(transcript);
    }
  };

  // Execute User Goal via Swarm Orchestrator
  const handleExecuteMultiAgentGoal = async (rawPrompt: string) => {
    const userPrompt = rawPrompt.trim();
    if (!userPrompt || isProcessing) return;

    setIsProcessing(true);
    voiceService.playTone('task_start');

    // 1. Add User Message
    const userMsg: AgentMessage = {
      id: 'user-' + Date.now(),
      senderId: 'user',
      senderName: 'المستخدم',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [userMsg, ...prev]);

    // 2. Set Agents Status to Planning
    setAgents((prev) => ({
      ...prev,
      master: { ...prev.master, status: 'planning', currentTask: 'تحليل وتوزيع المهام...' },
      startup: { ...prev.startup, status: 'idle' },
      windows: { ...prev.windows, status: 'idle' },
      office: { ...prev.office, status: 'idle' },
      web: { ...prev.web, status: 'idle' },
    }));

    try {
      // 3. Dispatch to Master Orchestrator API
      const response = await fetch('/api/orchestrator/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error('فشل استجابة الوكيل العام');
      }

      const planData: OrchestrationResult = await response.json();
      setCurrentPlan(planData);

      // Add Master Plan Message to conversation
      const masterMsg: AgentMessage = {
        id: 'master-' + Date.now(),
        senderId: 'master',
        senderName: 'الوكيل العام (Bogy Prime)',
        text: planData.planSummary || 'تم اعتماد خطة التنسيق وتوزيع المهام على الوكلاء.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [masterMsg, ...prev]);

      // Update spoken text and speak back
      if (planData.speechResponse) {
        setSpokenText(planData.speechResponse);
        setActiveSpeakerId('master');
        setActiveSpeakerName('الوكيل العام (Bogy Prime)');

        if (!audioMuted) {
          voiceService.speakText(
            planData.speechResponse,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false)
          );
        }
      }

      // 4. Concurrently trigger Sub-Agents
      setAgents((prev) => ({
        ...prev,
        master: { ...prev.master, status: 'executing' },
        windows: { ...prev.windows, status: 'executing', currentTask: 'تنفيذ أوامر ويندوز وإعداد السكربت' },
        office: { ...prev.office, status: 'executing', currentTask: 'إنشاء ملفات الإكسيل والوورد' },
        web: { ...prev.web, status: 'executing', currentTask: 'استكشاف الويب والتحميلات' },
      }));

      // Trigger all 3 sub-agents in parallel
      const [winRes, officeRes, webRes] = await Promise.allSettled([
        fetch('/api/agents/windows/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: userPrompt,
            actionType: 'powershell',
            context: planData.planSummary,
          }),
        }).then((r) => r.json()),

        fetch('/api/agents/office/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: userPrompt,
            documentType: 'both',
            requirements: planData.planSummary,
          }),
        }).then((r) => r.json()),

        fetch('/api/agents/web/search-and-browse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: userPrompt,
          }),
        }).then((r) => r.json()),
      ]);

      // Process Windows Agent Result
      if (winRes.status === 'fulfilled' && winRes.value) {
        const val = winRes.value;
        if (!val.error) {
          const newLog: WindowsCommandLog = {
            id: 'log-' + Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            command: val.commandExecuted || `Invoke-BogySystemTask -Target "${userPrompt.slice(0, 30)}"`,
            output: val.simulatedOutput || 'Status: Success. ExitCode: 0',
            status: 'success',
            script: val.generatedScript,
          };
          setWindowsLogs((prev) => [newLog, ...prev]);
          if (val.generatedScript) {
            setGeneratedScript(val.generatedScript);
          }
        }
      }

      // Process Office Agent Result
      if (officeRes.status === 'fulfilled' && officeRes.value) {
        const val = officeRes.value;
        if (!val.error) {
          if (val.excel && val.excel.headers && val.excel.rows) {
            setExcelData({
              title: val.excel.title || 'جدول البيانات التلقائي',
              sheetName: val.excel.sheetName || 'البيانات',
              fileName: val.excel.fileName || 'Bogy_Report.xlsx',
              headers: val.excel.headers,
              rows: val.excel.rows,
              summaryRow: val.excel.summaryRow,
              formulaDescription: val.excel.formulaDescription,
            });
          }
          if (val.word && val.word.sections) {
            setWordData({
              title: val.word.title || 'تقرير مستند الوورد الذكي',
              fileName: val.word.fileName || 'Bogy_Document.docx',
              subtitle: val.word.subtitle || 'صياغة آلية بواسطة وكيل المستندات',
              author: val.word.author || 'Bogy DocuMaster Agent',
              date: val.word.date || new Date().toISOString().split('T')[0],
              sections: val.word.sections,
            });
          }
        }
      }

      // Process Web Agent Result
      if (webRes.status === 'fulfilled' && webRes.value) {
        const val = webRes.value;
        if (!val.error) {
          if (val.summary) {
            setWebSummary(val.summary);
          }
          if (val.sources && Array.isArray(val.sources) && val.sources.length > 0) {
            setWebSources(val.sources);
          }
          if (val.downloadItems && Array.isArray(val.downloadItems)) {
            const newDls: DownloadItem[] = val.downloadItems.map((item: any, idx: number) => ({
              id: 'dl-gen-' + Date.now() + '-' + idx,
              name: item.name || 'Bogy_Resource.txt',
              extension: item.extension || 'txt',
              size: item.size || '1.8 MB',
              progress: 100,
              speed: 'Completed',
              status: 'completed',
              description: item.description,
              directDownloadContent: item.directDownloadContent,
            }));
            setDownloads((prev) => [...newDls, ...prev]);
          }
        }
      }

      // Update Analytics activity for all agents
      setHourlyActivity((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        const last = { ...updated[lastIdx] };
        last.master += 1;
        last.windows += 1;
        last.office += 1;
        last.web += 1;
        last.total =
          last.master + (last.startup || 0) + last.windows + last.office + last.web;
        updated[lastIdx] = last;
        return updated;
      });

      // Update agent states to completed
      setAgents((prev) => ({
        master: {
          ...prev.master,
          status: 'completed',
          currentTask: undefined,
          completedTasksCount: prev.master.completedTasksCount + 1,
        },
        startup: {
          ...prev.startup,
          status: 'idle',
        },
        windows: {
          ...prev.windows,
          status: 'completed',
          currentTask: undefined,
          completedTasksCount: prev.windows.completedTasksCount + 1,
        },
        office: {
          ...prev.office,
          status: 'completed',
          currentTask: undefined,
          completedTasksCount: prev.office.completedTasksCount + 1,
        },
        web: {
          ...prev.web,
          status: 'completed',
          currentTask: undefined,
          completedTasksCount: prev.web.completedTasksCount + 1,
        },
      }));

      voiceService.playTone('success');

      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#06b6d4', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
      });

      // Send Desktop Notification
      notificationService.notifyTaskCompletion(
        'سرب وكلاء بوجي (Bogy Swarm)',
        'اكتملت جميع المهام الموكلة بنجاح 🚀',
        planData.planSummary || 'تم تنفيذ كافة متطلبات النظام والمستندات والويب بدقة عالية.',
        'master'
      );
    } catch (err: any) {
      console.error('Error in multi-agent execution:', err);
      setAgents((prev) => ({
        ...prev,
        master: { ...prev.master, status: 'error', currentTask: 'حدث خطأ في المعالجة' },
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Replay speech response with natural voice
  const handleReplaySpeech = (text: string) => {
    if (!audioMuted) {
      setSpokenText(text);
      voiceService.speakText(
        text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        voiceService.getDefaultVoice()
      );
    }
  };

  // Speak custom natural sample
  const handleSpeakSample = (text: string, voice: string) => {
    if (!audioMuted) {
      setSpokenText(text);
      voiceService.speakText(
        text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        voice
      );
    }
  };

  // Play official welcome message
  const handlePlayWelcome = () => {
    const welcomeText =
      'مرحباً بكم ببرنامج وكلاء بوجي! نسعد بوجودكم معنا في منظومة الوكلاء الأذكياء. تحدث بأي أمر تريده، أو اضغط على أي وكيل ليعرفكم بنفسه ومهاراته.';
    setSpokenText(welcomeText);
    setActiveSpeakerId('master');
    setActiveSpeakerName('الوكيل العام (Bogy Prime)');

    if (!audioMuted) {
      voiceService.speakText(
        welcomeText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        voiceService.getDefaultVoice()
      );
    }
    notificationService.notifyTaskCompletion(
      'Bogy Agents AI',
      'مرحباً بكم ببرنامج وكلاء بوجي 🌟',
      'منظومة الوكلاء الصوتية بكامل طاقتها وجاهزة لتنفيذ كل طلباتك.',
      'master'
    );
  };

  // Agent self-introduction when clicked
  const handleAgentIntroduce = (agentId: AgentId) => {
    const INTROS: Record<AgentId, { name: string; text: string }> = {
      master: {
        name: 'الوكيل العام (Bogy Prime)',
        text: 'مرحباً بكم ببرنامج وكلاء بوجي! أنا الوكيل العام والموجه الرئيسي للمنظومة. أقوم باستقبال أوامرك وتوجيه باقي الوكلاء والتنسيق بينهم لتقديم أفضل النتائج.',
      },
      startup: {
        name: 'وكيل بدء التشغيل والإقلاع (Bogy Boot)',
        text: 'أهلاً بك! أنا وكيل بدء التشغيل والإقلاع التلقائي في برنامج وكلاء بوجي. أبدأ العمل فور تشغيل جهاز الكمبيوتر، وأقوم بفحص صحة النظام وخدمات ويندوز والترحيب بك وعرض المساعدة المباشرة لتنفيذ أي أمر.',
      },
      windows: {
        name: 'وكيل نظام ويندوز (Bogy WinSys)',
        text: 'أهلاً بك! أنا وكيل نظام ويندوز وسطح المكتب في برنامج وكلاء بوجي. أمتلك كافة القدرات لتشغيل أوامر باورشيل وCMD، ومراقبة استهلاك المعالج، وإنشاء سكربتات الصيانة والأتمتة.',
      },
      office: {
        name: 'وكيل المستندات والأوفيس (Bogy Office)',
        text: 'مرحباً بك! أنا وكيل المستندات والأوفيس في منظومة بوجي. أتميز بإنشاء جداول الإكسيل المتقدمة بالمعادلات وتصديرها كملفات إكسيل حقيقية، بالإضافة إلى صياغة تقارير وخطابات وورد الرسمية.',
      },
      web: {
        name: 'وكيل الإنترنت والتحميل (Bogy Web)',
        text: 'مرحباً! أنا وكيل الإنترنت والبحث والتحميل في برنامج بوجي. أستطيع تصفح المواقع بالذكاء الاصطناعي، واستخراج أحدث المعلومات من جوجل المباشر، وتنزيل الملفات والمراجع إلى جهازك.',
      },
    };

    const target = INTROS[agentId];
    if (!target) return;

    voiceService.playTone('activate');
    setSpokenText(target.text);
    setActiveSpeakerId(agentId);
    setActiveSpeakerName(target.name);

    // Add intro to conversation messages
    const introMsg: AgentMessage = {
      id: 'intro-' + Date.now(),
      senderId: agentId,
      senderName: target.name,
      text: `🎙️ ${target.text}`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [introMsg, ...prev]);

    // Speak intro out loud with natural voice
    if (!audioMuted) {
      voiceService.speakText(
        target.text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        voiceService.getDefaultVoice()
      );
    }

    notificationService.notifyTaskCompletion(
      target.name,
      'تعريف الوكيل بنفسه 🎙️',
      target.text,
      agentId
    );
  };

  // Direct Windows command runner
  const handleExecuteWindowsCommand = async (cmd: string) => {
    setIsWindowsExecuting(true);
    setAgents((prev) => ({
      ...prev,
      windows: { ...prev.windows, status: 'executing', currentTask: cmd },
    }));

    try {
      const response = await fetch('/api/agents/windows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd, actionType: 'powershell' }),
      });

      const data = await response.json();
      const newLog: WindowsCommandLog = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        command: data.commandExecuted || cmd,
        output: data.simulatedOutput || 'Status: Success (ExitCode 0)',
        status: 'success',
        script: data.generatedScript,
      };

      setWindowsLogs((prev) => [newLog, ...prev]);
      if (data.generatedScript) {
        setGeneratedScript(data.generatedScript);
      }

      recordAgentActivity('windows');
      setAgents((prev) => ({
        ...prev,
        windows: {
          ...prev.windows,
          status: 'completed',
          completedTasksCount: prev.windows.completedTasksCount + 1,
        },
      }));
      voiceService.playTone('success');
      notificationService.notifyTaskCompletion(
        'وكيل نظام ويندوز (WinSys Commander)',
        'تم تنفيذ أمر النظام بنجاح 💻',
        `نفذ الوكيل: ${cmd}`,
        'windows'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsWindowsExecuting(false);
    }
  };

  // Direct Web Search
  const handleSearchWeb = async (query: string) => {
    setIsWebSearching(true);
    setAgents((prev) => ({
      ...prev,
      web: { ...prev.web, status: 'executing', currentTask: query },
    }));

    try {
      const response = await fetch('/api/agents/web/search-and-browse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (data.summary) setWebSummary(data.summary);
      if (data.sources) setWebSources(data.sources);

      if (data.downloadItems && Array.isArray(data.downloadItems)) {
        const newDls: DownloadItem[] = data.downloadItems.map((item: any, idx: number) => ({
          id: 'dl-web-' + Date.now() + '-' + idx,
          name: item.name || 'Bogy_Web_Result.txt',
          extension: item.extension || 'txt',
          size: item.size || '1.2 MB',
          progress: 100,
          speed: 'Completed',
          status: 'completed',
          description: item.description,
          directDownloadContent: item.directDownloadContent,
        }));
        setDownloads((prev) => [...newDls, ...prev]);
      }

      recordAgentActivity('web');
      setAgents((prev) => ({
        ...prev,
        web: { ...prev.web, status: 'completed', completedTasksCount: prev.web.completedTasksCount + 1 },
      }));
      voiceService.playTone('success');
      notificationService.notifyTaskCompletion(
        'وكيل الإنترنت والتحميل (CyberWeb)',
        'اكتمل استكشاف الويب وتجهيز النتائج 🌐',
        `عُثر على نتائج ومصادر متعلقة بـ "${query}".`,
        'web'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsWebSearching(false);
    }
  };

  // Add custom download task
  const handleAddCustomDownload = (name: string, ext: string, size: string) => {
    const newItem: DownloadItem = {
      id: 'dl-custom-' + Date.now(),
      name,
      extension: ext,
      size,
      progress: 0,
      speed: '7.8 MB/s',
      status: 'downloading',
      description: 'مهمة تنزيل جديدة مضافة بواسطة المستخدم',
      directDownloadContent: `File: ${name}\nGenerated by Bogy Agents AI Swarm OS.\nTimestamp: ${new Date().toISOString()}`,
    };

    setDownloads((prev) => [newItem, ...prev]);

    // Simulate download progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      if (prog >= 100) {
        clearInterval(interval);
        setDownloads((prev) =>
          prev.map((d) => (d.id === newItem.id ? { ...d, progress: 100, status: 'completed', speed: 'Done' } : d))
        );
        recordAgentActivity('web');
        setAgents((prev) => ({
          ...prev,
          web: { ...prev.web, completedTasksCount: prev.web.completedTasksCount + 1 },
        }));
        notificationService.notifyTaskCompletion(
          'مدير التنزيلات (Bogy Web)',
          'اكتمل تنزيل الملف بنجاح 📥',
          `تم تنزيل "${name}" بنجاح وجاهز للاستخدام.`,
          'web'
        );
      } else {
        setDownloads((prev) =>
          prev.map((d) => (d.id === newItem.id ? { ...d, progress: prog } : d))
        );
      }
    }, 400);
  };

  // Update Excel Cell directly from editor
  const handleUpdateExcelCell = (rowIndex: number, colIndex: number, val: string | number) => {
    setExcelData((prev) => {
      const newRows = [...prev.rows];
      newRows[rowIndex] = [...newRows[rowIndex]];
      newRows[rowIndex][colIndex] = val;
      return { ...prev, rows: newRows };
    });
  };

  // Add Row to Excel Data
  const handleAddExcelRow = (row?: (string | number)[]) => {
    const defaultRow = row || [
      `PRJ-${100 + excelData.rows.length + 1}`,
      'مهمة استراتيجية جديدة',
      12,
      600,
      3200,
      4000,
    ];
    setExcelData((prev) => ({
      ...prev,
      rows: [...prev.rows, defaultRow],
    }));
    recordAgentActivity('office');
    setAgents((prev) => ({
      ...prev,
      office: { ...prev.office, completedTasksCount: prev.office.completedTasksCount + 1 },
    }));
  };

  // Generate Excel / Word Templates
  const handleGenerateTemplate = async (type: string) => {
    setIsOfficeGenerating(true);
    try {
      const res = await fetch('/api/agents/office/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: type, documentType: 'both' }),
      });
      const data = await res.json();
      if (data.excel) setExcelData(data.excel);
      if (data.word) setWordData(data.word);
      recordAgentActivity('office');
      setAgents((prev) => ({
        ...prev,
        office: { ...prev.office, completedTasksCount: prev.office.completedTasksCount + 1 },
      }));
      voiceService.playTone('success');
      notificationService.notifyTaskCompletion(
        'وكيل المستندات والأوفيس (DocuMaster)',
        'تم توليد القالب والمستندات بنجاح 📊',
        `تم إنشاء قالب: ${type} في إكسيل ووورد.`,
        'office'
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsOfficeGenerating(false);
    }
  };

  // Reset workspace
  const handleResetAll = () => {
    voiceService.stopSpeaking();
    voiceService.stopListening();
    setIsListening(false);
    setTranscript('');
    setCurrentPlan(null);
    setSpokenText('مرحباً بكم ببرنامج وكلاء بوجي! تمت إعادة ضبط مساحة العمل بنجاح.');
    setActiveSpeakerId('master');
    setMessages([
      {
        id: 'reset-msg',
        senderId: 'master',
        senderName: 'الوكيل العام (Bogy Prime)',
        text: 'مرحباً بكم ببرنامج وكلاء بوجي! تمت إعادة ضبط مساحة العمل بنجاح، وسرب الوكلاء بانتظار توجيهاتك الجديدة.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-cairo transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200'
          : 'bg-slate-50 text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900'
      }`}
    >
      {/* Top Application Header */}
      <Header
        agents={agents}
        isSpeaking={isSpeaking}
        isListening={isListening}
        audioMuted={audioMuted}
        onToggleMute={() => {
          if (!audioMuted) voiceService.stopSpeaking();
          setAudioMuted(!audioMuted);
        }}
        onResetAll={handleResetAll}
        lang={lang}
        onLangChange={handleLanguageChange}
        onPlayWelcome={handlePlayWelcome}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Container with Right Sidebar Layout */}
      <div className="flex-1 flex w-full relative overflow-x-hidden">
        {/* Right Sidebar: 5 Agents, Voice intros, and shortcuts */}
        <RightSidebar
          agents={agents}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onAgentIntroduce={handleAgentIntroduce}
          isOpen={isSidebarOpen}
          onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
          theme={theme}
          onSimulateBoot={handleSimulateBoot}
          isProcessing={isProcessing}
        />

        {/* Main Command & Swarm Workspace */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Desktop Notifications Permission & Status Banner */}
          <NotificationBanner />

          {/* 1. Live Spoken Speech Display & Teleprompter Bar (عرض الكلام الذي يُنطق) */}
          <LiveSpeechDisplay
            spokenText={spokenText}
            speakerId={activeSpeakerId}
            speakerName={activeSpeakerName}
            isSpeaking={isSpeaking}
            isListening={isListening}
            audioMuted={audioMuted}
            theme={theme}
            onReplay={handleReplaySpeech}
            onStopSpeaking={() => {
              voiceService.stopSpeaking();
              setIsSpeaking(false);
            }}
            agents={agents}
          />

          {/* 2. Core Voice Controller & Audio Hub */}
          <VoiceController
            isListening={isListening}
            isProcessing={isProcessing}
            transcript={transcript}
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
            onSubmitCommand={handleExecuteMultiAgentGoal}
          />

          {/* 3. Natural AI Voice Engine & Human Persona Controller */}
          <NaturalVoiceStudio
            isSpeaking={isSpeaking}
            audioMuted={audioMuted}
            onToggleMute={() => {
              if (!audioMuted) voiceService.stopSpeaking();
              setAudioMuted(!audioMuted);
            }}
            lastSpeechText={currentPlan?.speechResponse || messages.find((m) => m.senderId === 'master')?.text}
            onSpeakSample={handleSpeakSample}
          />

          {/* 4. Interactive Agent Swarm Topology Map with 5 Agents */}
          <AgentSwarmView
            agents={agents}
            activeTab={activeTab}
            onSelectAgentTab={(id) => setActiveTab(id)}
            onAgentIntroduce={handleAgentIntroduce}
            isProcessing={isProcessing}
            theme={theme}
          />

          {/* 5. Navigation Bar to focus on specific agent consoles or Recharts Analytics */}
          <AgentQuickBar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            theme={theme}
          />

          {/* 6. Active Workspaces Deck */}
          <div className="transition-all duration-300">
            {/* VIEW: All-in-One Swarm Dashboard */}
            {activeTab === 'swarm' && (
              <div className="space-y-6">
                {/* Orchestrator Master Plan */}
                <MasterOrchestratorView
                  currentPlan={currentPlan}
                  messages={messages}
                  isProcessing={isProcessing}
                  onReplaySpeech={handleReplaySpeech}
                  onSelectAgentTab={(id) => setActiveTab(id)}
                />

                {/* RECHARTS ANALYTICS SECTION: Completed Tasks Throughout The Day */}
                <AgentActivityAnalytics
                  agents={agents}
                  hourlyActivity={hourlyActivity}
                  theme={theme}
                />

                {/* Sub-Agent Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Startup Boot Mini-View */}
                  <div
                    className={`rounded-xl p-4 flex flex-col justify-between border transition-all ${
                      theme === 'dark' ? 'bg-slate-900/60 border-amber-900/40' : 'bg-white border-amber-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800/40 pb-2">
                        <h4 className="font-bold text-xs text-amber-500">وكيل بدء التشغيل (Bogy Boot)</h4>
                        <button
                          onClick={() => setActiveTab('startup')}
                          className="text-[11px] text-amber-500 hover:underline cursor-pointer"
                        >
                          عرض ←
                        </button>
                      </div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        يعمل فور إقلاع الجهاز، الترحيب التلقائي، وفحص استقرار كافة المكونات.
                      </p>
                    </div>
                    <div className="mt-3 text-[11px] flex items-center justify-between">
                      <span className="text-amber-500 font-mono">الإقلاع: نشط 100%</span>
                      <button
                        onClick={handleSimulateBoot}
                        className="px-2 py-1 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] cursor-pointer"
                      >
                        محاكاة الإقلاع
                      </button>
                    </div>
                  </div>

                  {/* Windows Mini-View */}
                  <div
                    className={`rounded-xl p-4 flex flex-col justify-between border transition-all ${
                      theme === 'dark' ? 'bg-slate-900/60 border-blue-900/40' : 'bg-white border-blue-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800/40 pb-2">
                        <h4 className="font-bold text-xs text-blue-500">وكيل ويندوز (PowerShell)</h4>
                        <button
                          onClick={() => setActiveTab('windows')}
                          className="text-[11px] text-blue-500 hover:underline cursor-pointer"
                        >
                          عرض ←
                        </button>
                      </div>
                      <pre className="text-[10px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800 max-h-32 overflow-y-auto ltr text-left">
                        {windowsLogs[0]?.output || 'PS C:\\> System online'}
                      </pre>
                    </div>
                    <div className="mt-3 text-[11px] flex items-center justify-between">
                      <span className="text-blue-500 font-mono">صلاحيات كاملة</span>
                      <button
                        onClick={() => setActiveTab('windows')}
                        className="px-2 py-1 rounded bg-blue-600/20 text-blue-500 border border-blue-500/30 text-[10px] cursor-pointer"
                      >
                        تحميل السكربت
                      </button>
                    </div>
                  </div>

                  {/* Office Mini-View */}
                  <div
                    className={`rounded-xl p-4 flex flex-col justify-between border transition-all ${
                      theme === 'dark' ? 'bg-slate-900/60 border-emerald-900/40' : 'bg-white border-emerald-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800/40 pb-2">
                        <h4 className="font-bold text-xs text-emerald-500">وكيل المستندات (Excel & Word)</h4>
                        <button
                          onClick={() => setActiveTab('office')}
                          className="text-[11px] text-emerald-500 hover:underline cursor-pointer"
                        >
                          عرض ←
                        </button>
                      </div>
                      <div className="text-xs space-y-1">
                        <p className={`font-semibold truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                          {excelData.title}
                        </p>
                        <p className="text-[11px] text-emerald-500 font-mono truncate">
                          {excelData.formulaDescription}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] flex items-center justify-between">
                      <span className="text-emerald-500 font-mono">XLSX + DOCX</span>
                      <button
                        onClick={() => setActiveTab('office')}
                        className="px-2 py-1 rounded bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 text-[10px] cursor-pointer"
                      >
                        تنزيل الملفات
                      </button>
                    </div>
                  </div>

                  {/* Web Mini-View */}
                  <div
                    className={`rounded-xl p-4 flex flex-col justify-between border transition-all ${
                      theme === 'dark' ? 'bg-slate-900/60 border-violet-900/40' : 'bg-white border-violet-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-slate-800/40 pb-2">
                        <h4 className="font-bold text-xs text-violet-500">وكيل الإنترنت والتحميل</h4>
                        <button
                          onClick={() => setActiveTab('web')}
                          className="text-[11px] text-violet-500 hover:underline cursor-pointer"
                        >
                          عرض ←
                        </button>
                      </div>
                      <p className={`text-xs line-clamp-3 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {webSummary}
                      </p>
                    </div>
                    <div className="mt-3 text-[11px] flex items-center justify-between">
                      <span className="text-violet-500 font-mono">{downloads.length} ملفات</span>
                      <button
                        onClick={() => setActiveTab('web')}
                        className="px-2 py-1 rounded bg-violet-600/20 text-violet-500 border border-violet-500/30 text-[10px] cursor-pointer"
                      >
                        التحميلات
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: Startup & Auto-Boot Agent Console */}
            {activeTab === 'startup' && (
              <StartupAgentView
                agent={agents.startup}
                theme={theme}
                onSimulateBoot={handleSimulateBoot}
                onPlayGreeting={() => {
                  const bootGreeting =
                    'مرحباً بكم في برنامج وكلاء بوجي للذكاء الاصطناعي! أنا وكيل بدء التشغيل والإقلاع التلقائي، تم فحص استقرار النظام والخدمات، وجاهز لمساعدتكم في تنفيذ أي أمر ترغبون به فوراً!';
                  setSpokenText(bootGreeting);
                  setActiveSpeakerId('startup');
                  setActiveSpeakerName('وكيل بدء التشغيل (Bogy Boot)');
                  if (!audioMuted) {
                    voiceService.speakText(
                      bootGreeting,
                      () => setIsSpeaking(true),
                      () => setIsSpeaking(false)
                    );
                  }
                }}
                onExecuteQuickCommand={(cmd) => {
                  handleExecuteMultiAgentGoal(cmd);
                }}
                isProcessing={isProcessing}
                isSpeaking={isSpeaking}
              />
            )}

            {/* VIEW: Dedicated Recharts Analytics View */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <AgentActivityAnalytics
                  agents={agents}
                  hourlyActivity={hourlyActivity}
                  theme={theme}
                />
              </div>
            )}

            {/* VIEW: Master Orchestrator View */}
            {activeTab === 'master' && (
              <MasterOrchestratorView
                currentPlan={currentPlan}
                messages={messages}
                isProcessing={isProcessing}
                onReplaySpeech={handleReplaySpeech}
                onSelectAgentTab={(id) => setActiveTab(id)}
              />
            )}

            {/* VIEW: Windows Agent Console */}
            {activeTab === 'windows' && (
              <WindowsAgentView
                logs={windowsLogs}
                onExecuteCustomCommand={handleExecuteWindowsCommand}
                isExecuting={isWindowsExecuting}
                generatedScript={generatedScript}
                theme={theme}
              />
            )}

            {/* VIEW: Office & Documents Agent Console */}
            {activeTab === 'office' && (
              <OfficeAgentView
                excelData={excelData}
                wordData={wordData}
                onUpdateExcelCell={handleUpdateExcelCell}
                onAddExcelRow={handleAddExcelRow}
                onGenerateTemplate={handleGenerateTemplate}
                isGenerating={isOfficeGenerating}
                theme={theme}
              />
            )}

            {/* VIEW: Web & Downloader Agent Console */}
            {activeTab === 'web' && (
              <WebAgentView
                summary={webSummary}
                sources={webSources}
                downloads={downloads}
                onSearchWeb={handleSearchWeb}
                isSearching={isWebSearching}
                onAddCustomDownload={handleAddCustomDownload}
                theme={theme}
              />
            )}
          </div>
        </main>
      </div>

      {/* App Footer */}
      <footer
        className={`border-t py-4 text-center text-xs transition-colors ${
          theme === 'dark' ? 'border-slate-900 bg-slate-950/80 text-slate-500' : 'border-slate-200 bg-white text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Bogy Agents AI Swarm OS • برنامج وكلاء بوجي للذكاء الاصطناعي • مرحباً بكم ببرنامج وكلاء بوجي</span>
          <span className="font-mono text-[11px] text-cyan-500">
            Powered by Recharts Analytics & Gemini 3.8 Flash
          </span>
        </div>
      </footer>
    </div>
  );
}
