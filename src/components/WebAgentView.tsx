import React, { useState } from 'react';
import { Globe, Search, Download, ExternalLink, ArrowLeft, ArrowRight, RotateCw, Lock, FileText, CheckCircle2, Pause, Play, Plus, Sparkles } from 'lucide-react';
import { WebSearchResult, DownloadItem } from '../types/agent';
import { FileExportService } from '../services/fileExportService';

interface WebAgentViewProps {
  summary: string;
  sources: WebSearchResult[];
  downloads: DownloadItem[];
  onSearchWeb: (query: string) => void;
  isSearching: boolean;
  onAddCustomDownload: (name: string, ext: string, size: string) => void;
}

export const WebAgentView: React.FC<WebAgentViewProps> = ({
  summary,
  sources,
  downloads,
  onSearchWeb,
  isSearching,
  onAddCustomDownload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [browserUrl, setBrowserUrl] = useState('https://www.google.com/search?q=AI+Agents+Enterprise');
  const [activeTab, setActiveTab] = useState<'browse' | 'downloads'>('browse');

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
    const content = item.directDownloadContent || `Nexus AI Web Downloaded Resource\nName: ${item.name}\nSize: ${item.size}\nDate: ${new Date().toISOString()}\n\nContent:\n${summary}`;
    FileExportService.triggerDownload(content, item.name, 'text/plain');
  };

  return (
    <div className="space-y-4">
      {/* Top Viewport Navigation Tabs */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>متصفح الويب والبحث المباشر</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>مدير التحميلات والملفات ({downloads.length})</span>
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
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-[11px] truncate max-w-[150px] cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: BROWSER VIEWPORT */}
      {activeTab === 'browse' && (
        <div className="rounded-xl bg-slate-900 border border-violet-900/40 shadow-xl overflow-hidden">
          {/* Browser Address & Control Bar */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-500">
              <button className="p-1 hover:text-slate-300 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
              <button className="p-1 hover:text-slate-300 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
              <button
                onClick={() => searchQuery && onSearchWeb(searchQuery)}
                className={`p-1 hover:text-slate-300 transition-colors ${isSearching ? 'animate-spin text-violet-400' : ''}`}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Address Bar Form */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
              <div className="w-full flex items-center bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200">
                <Lock className="w-3 h-3 text-emerald-400 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الإنترنت أو أدخل رابط موقع..."
                  className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-xs"
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || isSearching}
                  className="text-violet-400 hover:text-violet-300 mr-1 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Web Viewport Content */}
          <div className="p-5 max-h-[460px] overflow-y-auto space-y-4">
            {/* Extracted AI Web Summary */}
            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-900/50">
              <div className="flex items-center gap-2 mb-2 text-violet-300 text-xs font-bold">
                <Globe className="w-4 h-4 text-violet-400" />
                <span>ملخص استكشاف الويب والبيانات المستخرجة:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {summary || 'وكيل الويب جاهز لتصفح أي موقع واستخراج المعلومات وتحميل الملفات لك فوراً.'}
              </p>
            </div>

            {/* Live Sources & Citations */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
                <span>المصادر والمواقع المستكشفة ({sources.length}):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-violet-500/50 transition-all group block"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-violet-300 transition-colors line-clamp-1">
                        {src.title}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-violet-400" />
                    </div>
                    <span className="text-[10px] font-mono text-violet-400/80 block truncate ltr text-left mb-1">
                      {src.url}
                    </span>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {src.snippet}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOWNLOAD MANAGER */}
      {activeTab === 'downloads' && (
        <div className="rounded-xl bg-slate-900 border border-violet-900/40 shadow-xl overflow-hidden p-4">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-slate-200 text-sm">قائمة التنزيلات ومدير الملفات الرقمية</h3>
              <p className="text-xs text-slate-400">
                الملفات والتقارير المستخرجة الجاهزة للتنزيل المباشر على قرص جهازك
              </p>
            </div>

            <button
              onClick={() => onAddCustomDownload('Dataset_Export_2025.csv', 'csv', '3.2 MB')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة مهمة تحميل</span>
            </button>
          </div>

          <div className="space-y-3">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-xs uppercase font-mono">
                    {item.extension}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200">{item.name}</h4>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span className="text-violet-400">{item.speed}</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status === 'completed' ? 'جاهز للتنزيل' : 'جاري المعالجة'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Download Trigger */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="w-24 hidden md:block">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-violet-500 h-full rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadRealFile(item)}
                    className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-violet-600/20 cursor-pointer w-full sm:w-auto justify-center"
                    title="تحميل الملف فوراً إلى جهازك"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل لجهازك</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
