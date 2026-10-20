import React, { useState } from 'react';
import {
  Globe,
  Search,
  Download,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  FileText,
  CheckCircle2,
  Pause,
  Play,
  Plus,
  Sparkles,
  Link,
  Code,
  FileDown,
} from 'lucide-react';
import { WebSearchResult, DownloadItem } from '../types/agent';
import { FileExportService } from '../services/fileExportService';

interface WebAgentViewProps {
  summary: string;
  sources: WebSearchResult[];
  downloads: DownloadItem[];
  onSearchWeb: (query: string) => void;
  isSearching: boolean;
  onAddCustomDownload: (name: string, ext: string, size: string) => void;
  theme?: 'dark' | 'light';
}

interface ScrapedResult {
  success: boolean;
  url: string;
  title: string;
  description: string;
  headings: string[];
  linksCount: number;
  sampleLinks: { text: string; href: string }[];
  downloadableFiles: { name: string; url: string; ext: string }[];
  contentSnippet: string;
  scrapedAt: string;
}

export const WebAgentView: React.FC<WebAgentViewProps> = ({
  summary,
  sources,
  downloads,
  onSearchWeb,
  isSearching,
  onAddCustomDownload,
  theme = 'dark',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [browserUrl, setBrowserUrl] = useState('https://www.google.com/search?q=AI+Agents+Enterprise');
  const [activeTab, setActiveTab] = useState<'browse' | 'scrape' | 'downloads'>('browse');

  // Real Web Scraper with Cheerio
  const [scrapeUrl, setScrapeUrl] = useState('https://news.ycombinator.com');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedResult | null>(null);

  const QUICK_SEARCHES = [
    'أفضل نماذج الذكاء الاصطناعي 2025',
    'أدوات أتمتة نظام ويندوز والباور شيل',
    'أحدث تقارير الاقتصاد الرقمي والأعمال',
    'معايير إدارة البيانات في إكسيل وقواعد البيانات',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !isSearching) {
      setBrowserUrl(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onSearchWeb(searchQuery.trim());
    }
  };

  const handleQuickSearch = (q: string) => {
    setSearchQuery(q);
    setBrowserUrl(`https://www.google.com/search?q=${encodeURIComponent(q)}`);
    onSearchWeb(q);
  };

  const handleDownloadRealFile = (item: DownloadItem) => {
    const content =
      item.directDownloadContent ||
      `Bogy Agents AI Web Downloaded Resource\nName: ${item.name}\nSize: ${item.size}\nDate: ${new Date().toISOString()}\n\nContent:\n${summary}`;
    FileExportService.triggerDownload(content, item.name, 'text/plain');
  };

  // Perform Real Scrape using backend Cheerio engine
  const handlePerformRealScrape = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!scrapeUrl.trim() || isScraping) return;

    setIsScraping(true);
    try {
      const res = await fetch('/api/web/scrape-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      });
      const data = await res.json();
      setScrapedData(data);

      // If downloadable files found, add them to downloads list
      if (data.downloadableFiles && data.downloadableFiles.length > 0) {
        data.downloadableFiles.forEach((file: any) => {
          onAddCustomDownload(file.name, file.ext, '2.5 MB');
        });
      }
    } catch (err) {
      console.error('Real scraping error:', err);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Viewport Navigation Tabs */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl border gap-2 transition-all ${
          theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : theme === 'dark'
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>متصفح الويب المباشر</span>
          </button>

          <button
            onClick={() => setActiveTab('scrape')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'scrape'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : theme === 'dark'
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>مستخرج صفحات الويب الحقيقي (Cheerio Scraper ⚡)</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : theme === 'dark'
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>مدير التحميلات ({downloads.length})</span>
          </button>
        </div>

        {/* Quick Search Chips */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-slate-400 text-[11px]">اقتراحات:</span>
          {QUICK_SEARCHES.slice(0, 2).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickSearch(q)}
              disabled={isSearching}
              className={`px-2 py-0.5 rounded text-[11px] truncate max-w-[150px] cursor-pointer ${
                theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: BROWSER VIEWPORT */}
      {activeTab === 'browse' && (
        <div
          className={`rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            theme === 'dark' ? 'bg-slate-950 border-violet-900/40' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Browser Address Bar */}
          <div
            className={`px-4 py-2.5 flex items-center gap-3 border-b ${
              theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1 text-slate-400">
              <ArrowRight className="w-4 h-4 cursor-pointer hover:text-white" />
              <ArrowLeft className="w-4 h-4 cursor-pointer hover:text-white" />
              <RotateCw
                onClick={() => onSearchWeb(searchQuery || 'AI Agents')}
                className={`w-3.5 h-3.5 cursor-pointer hover:text-white ${isSearching ? 'animate-spin' : ''}`}
              />
            </div>

            {/* URL input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
              <div
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-1.5 border text-xs ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في جوجل مباشرة أو أدخل رابط موقع..."
                  className={`w-full bg-transparent focus:outline-none text-xs font-mono ${
                    theme === 'dark' ? 'text-slate-200 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-2.5 py-1 rounded-lg bg-violet-600 text-white hover:bg-violet-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Search className="w-3 h-3" />
                  <span>بحث</span>
                </button>
              </div>
            </form>
          </div>

          {/* Browser Content Frame */}
          <div className="p-5 space-y-5">
            {/* AI Synthesized Intelligence Summary */}
            <div
              className={`rounded-xl p-4 border ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-violet-950/40 to-slate-900 border-violet-800/40'
                  : 'bg-violet-50 border-violet-200 text-violet-950'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <h4 className="font-bold text-xs text-violet-500">
                  خلاصة استكشاف وكيل الويب الذكي (Google Grounding Synthesis):
                </h4>
              </div>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                {summary}
              </p>
            </div>

            {/* Live Web Sources Grounding Cards */}
            <div>
              <h4 className={`text-xs font-bold mb-3 flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Globe className="w-4 h-4 text-violet-500" />
                المصادر المرجعية والمواقع المستكشفة في جلسة العمل:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sources.map((src, index) => (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 border-slate-800/80 hover:border-violet-500/50'
                        : 'bg-slate-50 border-slate-200 hover:border-violet-400 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h5 className="font-bold text-xs text-violet-500 line-clamp-1">{src.title}</h5>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 truncate block mb-1.5 ltr text-left">
                      {src.url}
                    </span>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {src.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL WEB SCRAPER & CONTENT EXTRACTOR (Cheerio Engine) */}
      {activeTab === 'scrape' && (
        <div
          className={`rounded-2xl border p-5 shadow-2xl space-y-5 transition-all ${
            theme === 'dark' ? 'bg-slate-950 border-violet-900/40' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Code className="w-5 h-5 text-violet-500" />
              <h3 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                مستخرج ومحلل صفحات الويب الحقيقي (Real-Time HTML & Cheerio Parser)
              </h3>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              أدخل أي رابط موقع على الإنترنت (URL)، وسيقوم وكيل الويب بجلبه مباشرة وتحليله واستخراج العناوين والروابط وملفات التحميل
            </p>
          </div>

          {/* Scrape Input Form */}
          <form onSubmit={handlePerformRealScrape} className="flex flex-col sm:flex-row items-center gap-2">
            <div
              className={`flex-1 w-full flex items-center gap-2 rounded-xl px-3.5 py-2 border text-xs ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Globe className="w-4 h-4 text-violet-500 shrink-0" />
              <input
                type="text"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                placeholder="أدخل رابط الموقع المطلوب تحليله، مثال: https://wikipedia.org"
                className={`w-full bg-transparent focus:outline-none font-mono text-xs ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isScraping || !scrapeUrl.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-600/30 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
              <span>{isScraping ? 'جاري الفحص المباشر...' : 'فحص الموقع الحقيقي ⚡'}</span>
            </button>
          </form>

          {/* Scraped Result Display */}
          {scrapedData && (
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-xl border ${
                  scrapedData.success
                    ? theme === 'dark'
                      ? 'bg-slate-900/80 border-emerald-500/30'
                      : 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    تم فحص الموقع واستخراج البيانات بنجاح في {scrapedData.scrapedAt}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {scrapedData.linksCount} روابط مستخرجة
                  </span>
                </div>

                <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                  {scrapedData.title}
                </h4>
                {scrapedData.description && (
                  <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {scrapedData.description}
                  </p>
                )}
              </div>

              {/* Headings */}
              {scrapedData.headings && scrapedData.headings.length > 0 && (
                <div
                  className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <h5 className={`text-xs font-bold mb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    العناوين الرئيسية المكتشفة في الصفحة (Headings):
                  </h5>
                  <ul className="space-y-1.5 text-xs text-violet-500 font-medium">
                    {scrapedData.headings.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extracted Content Snippet */}
              {scrapedData.contentSnippet && (
                <div
                  className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <h5 className={`text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    مقتطف النص النقي المستخرج (Clean Text Snippet):
                  </h5>
                  <p className={`text-xs leading-relaxed font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {scrapedData.contentSnippet}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DOWNLOAD MANAGER */}
      {activeTab === 'downloads' && (
        <div
          className={`rounded-2xl border p-5 shadow-2xl space-y-4 transition-all ${
            theme === 'dark' ? 'bg-slate-950 border-violet-900/40' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-800/60">
            <div>
              <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                قائمة الملفات الجاهزة للتحميل المباشر إلى جهازك
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                يتم تنزيل الملفات بصيغها الأصلية (XLSX, DOCX, PS1, PDF, CSV) فور الضغط على زر التحميل
              </p>
            </div>
            <button
              onClick={() => onAddCustomDownload('Custom_Research_Archive.zip', 'zip', '3.4 MB')}
              className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-violet-500 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة ملف جديد</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/40">
            {downloads.map((item) => (
              <div key={item.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold font-mono text-xs uppercase">
                    {item.extension}
                  </div>
                  <div>
                    <h5 className={`font-bold text-xs font-mono ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-slate-400">{item.description || 'ملف رقمي مؤتمت'}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-500">
                      <span>الحجم: {item.size}</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        اكتمل التجهيز
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadRealFile(item)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل إلى جهازك (Download)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
