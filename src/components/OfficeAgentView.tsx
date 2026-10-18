import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Download, Plus, Sparkles, Printer, Check, Calculator, Edit3, Table } from 'lucide-react';
import { ExcelSheetData, WordDocumentData } from '../types/agent';
import { FileExportService } from '../services/fileExportService';

interface OfficeAgentViewProps {
  excelData: ExcelSheetData;
  wordData: WordDocumentData;
  onUpdateExcelCell: (rowIndex: number, colIndex: number, value: string | number) => void;
  onAddExcelRow: () => void;
  onGenerateTemplate: (templateType: string) => void;
  isGenerating: boolean;
}

export const OfficeAgentView: React.FC<OfficeAgentViewProps> = ({
  excelData,
  wordData,
  onUpdateExcelCell,
  onAddExcelRow,
  onGenerateTemplate,
  isGenerating,
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'excel' | 'word'>('excel');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const COLUMN_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const handleDownloadExcel = (format: 'xlsx' | 'csv' = 'xlsx') => {
    const success = FileExportService.exportToExcel(excelData, format);
    if (success) {
      setDownloadSuccess(`تم تنزيل ملف ${format.toUpperCase()} بنجاح على جهازك!`);
      setTimeout(() => setDownloadSuccess(null), 3500);
    }
  };

  const handleDownloadWord = () => {
    const success = FileExportService.exportToWord(wordData);
    if (success) {
      setDownloadSuccess('تم تنزيل مستند الوورد (.docx) بنجاح على جهازك!');
      setTimeout(() => setDownloadSuccess(null), 3500);
    }
  };

  const handlePrintWord = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Switch between Excel and Word & Quick Templates */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveDocTab('excel')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeDocTab === 'excel'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>محرر وجدول الإكسيل (Excel .xlsx)</span>
          </button>

          <button
            onClick={() => setActiveDocTab('word')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeDocTab === 'word'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>مستند وتقارير الوورد (Word .docx)</span>
          </button>
        </div>

        {/* Quick Generation Templates */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">نماذج سريعة:</span>
          <button
            onClick={() => onGenerateTemplate('sales_report')}
            disabled={isGenerating}
            className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] whitespace-nowrap cursor-pointer"
          >
            📊 تقرير مبيعات
          </button>
          <button
            onClick={() => onGenerateTemplate('payroll')}
            disabled={isGenerating}
            className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] whitespace-nowrap cursor-pointer"
          >
            💼 مسير رواتب
          </button>
          <button
            onClick={() => onGenerateTemplate('budget_plan')}
            disabled={isGenerating}
            className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] whitespace-nowrap cursor-pointer"
          >
            📈 ميزانية 2025
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">READY IN DOWNLOADS</span>
        </div>
      )}

      {/* TAB 1: EXCEL SPREADSHEET VIEWER & EDITOR */}
      {activeDocTab === 'excel' && (
        <div className="rounded-xl bg-slate-900 border border-emerald-900/40 shadow-xl overflow-hidden">
          {/* Excel Toolbar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-xs sm:text-sm">{excelData.title}</h3>
                <span className="text-[10px] font-mono text-slate-500">
                  ورقة العمل: {excelData.sheetName} | {excelData.rows.length} صفوف بيانات
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onAddExcelRow}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="إضافة صف جديد للجدول"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة صف</span>
              </button>

              <button
                onClick={() => handleDownloadExcel('csv')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="تصدير كملف CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              <button
                onClick={() => handleDownloadExcel('xlsx')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/30 cursor-pointer"
                title="تنزيل كملف إكسيل أصلي جاهز للفتح في Microsoft Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل ملف Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Formula Bar */}
          <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold text-[11px]">fx</span>
            <span className="text-slate-400 text-[11px] truncate">
              {excelData.formulaDescription || '=SUM(E2:E' + (excelData.rows.length + 1) + ') - إجمالي الحسابات الآلي'}
            </span>
          </div>

          {/* Interactive Grid Table */}
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-xs border-b border-slate-800">
                  <th className="w-10 py-2 px-3 text-center border-l border-slate-800/60 font-mono text-[11px] bg-slate-900/60">
                    #
                  </th>
                  {excelData.headers.map((h, colIdx) => (
                    <th
                      key={colIdx}
                      className="py-2.5 px-3 font-semibold text-slate-200 border-l border-slate-800/60 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span>{h}</span>
                        <span className="text-[10px] font-mono text-emerald-500/70 ml-1">
                          {COLUMN_LETTERS[colIdx] || ''}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {excelData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40 group">
                    <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-500 bg-slate-950/40 border-l border-slate-800/60">
                      {rIdx + 1}
                    </td>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-1 px-2 border-l border-slate-800/40">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => onUpdateExcelCell(rIdx, cIdx, e.target.value)}
                          className="w-full bg-transparent px-1.5 py-1 rounded text-slate-200 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
                        />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Summary / Totals Row */}
                {excelData.summaryRow && excelData.summaryRow.length > 0 && (
                  <tr className="bg-emerald-950/30 font-bold border-t-2 border-emerald-700/60 text-emerald-300">
                    <td className="py-2 px-3 text-center font-mono text-[11px] bg-emerald-950/40 border-l border-slate-800/60">
                      ∑
                    </td>
                    {excelData.summaryRow.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 border-l border-slate-800/40 font-mono">
                        {cell}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WORD DOCUMENT VIEWER & EXPORTER */}
      {activeDocTab === 'word' && (
        <div className="rounded-xl bg-slate-900 border border-blue-900/40 shadow-xl overflow-hidden">
          {/* Word Toolbar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-xs sm:text-sm">{wordData.title}</h3>
                <span className="text-[10px] font-mono text-slate-500">
                  {wordData.fileName} | {wordData.sections.length} أقسام رئيسية
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintWord}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="طباعة أو حفظ كملف PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة / PDF</span>
              </button>

              <button
                onClick={handleDownloadWord}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/30 cursor-pointer"
                title="تنزيل كملف وورد حقيقي (.docx) منسق"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل مستند Word (.docx)</span>
              </button>
            </div>
          </div>

          {/* Styled Word Document Canvas */}
          <div className="p-6 sm:p-8 bg-slate-950/60 max-h-[480px] overflow-y-auto">
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Document Header Letterhead */}
              <div className="border-b border-slate-800 pb-5 text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800">
                  BOGY AGENTS AI OFFICIAL INTELLIGENCE REPORT
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-3 mb-1">
                  {wordData.title}
                </h1>
                {wordData.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">{wordData.subtitle}</p>
                )}
                <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-slate-500 mt-3">
                  <span>إعداد: {wordData.author}</span>
                  <span>•</span>
                  <span>التاريخ: {wordData.date}</span>
                </div>
              </div>

              {/* Document Content Sections */}
              <div className="space-y-5">
                {wordData.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h2 className="text-sm font-bold text-cyan-300 border-r-4 border-blue-500 pr-2.5 py-0.5">
                      {sec.heading}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line text-justify pl-2">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sign-off footer */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>الاعتماد: وكيل الذكاء الاصطناعي للمستندات</span>
                <span className="font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  تم التدقيق والصياغة بدقة
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
