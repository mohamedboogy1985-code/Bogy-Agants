import * as XLSX from 'xlsx';
import { ExcelSheetData, WordDocumentData } from '../types/agent';

export class FileExportService {
  // Export Excel (.xlsx) file using SheetJS
  public static exportToExcel(data: ExcelSheetData, format: 'xlsx' | 'csv' = 'xlsx') {
    try {
      const allRows: (string | number)[][] = [data.headers, ...data.rows];
      if (data.summaryRow && data.summaryRow.length > 0) {
        allRows.push(data.summaryRow);
      }

      const worksheet = XLSX.utils.aoa_to_sheet(allRows);

      // Set approximate column widths
      const colWidths = data.headers.map((h) => ({
        wch: Math.max(String(h).length * 2, 16),
      }));
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, data.sheetName || 'NexusReport');

      const fileExt = format === 'xlsx' ? 'xlsx' : 'csv';
      const defaultFileName = data.fileName.endsWith(`.${fileExt}`)
        ? data.fileName
        : `${data.fileName.replace(/\.[^/.]+$/, '')}.${fileExt}`;

      XLSX.writeFile(workbook, defaultFileName, { bookType: format });
      return true;
    } catch (error) {
      console.error('Failed to export Excel file:', error);
      return false;
    }
  }

  // Export Word (.docx compatible) file with rich HTML styling
  public static exportToWord(doc: WordDocumentData) {
    try {
      const sectionsHtml = doc.sections
        .map(
          (sec) => `
        <div style="margin-bottom: 24px;">
          <h2 style="color: #0f172a; font-size: 18pt; border-bottom: 2px solid #0284c7; padding-bottom: 6px; margin-top: 20px;">
            ${sec.heading}
          </h2>
          <p style="font-size: 12pt; line-height: 1.8; color: #334155; white-space: pre-line; text-align: justify;">
            ${sec.content}
          </p>
        </div>
      `
        )
        .join('');

      const fullHtmlDoc = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${doc.title}</title>
          <style>
            @page {
              size: A4;
              margin: 2.54cm;
            }
            body {
              font-family: 'Arial', 'Segoe UI', Tahoma, sans-serif;
              direction: rtl;
              text-align: right;
              background-color: #ffffff;
              color: #1e293b;
              padding: 20px;
            }
            .header-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 24px;
              margin-bottom: 30px;
              text-align: center;
            }
            .title {
              font-size: 24pt;
              font-weight: bold;
              color: #0369a1;
              margin: 0 0 10px 0;
            }
            .meta {
              font-size: 11pt;
              color: #64748b;
            }
            .footer-box {
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #cbd5e1;
              font-size: 10pt;
              color: #94a3b8;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header-box">
            <h1 class="title">${doc.title}</h1>
            ${doc.subtitle ? `<p style="font-size: 14pt; color: #475569; margin: 4px 0 12px 0;">${doc.subtitle}</p>` : ''}
            <div class="meta">
              <span>تاريخ التقرير: ${doc.date}</span> | 
              <span>جهة الإعداد: ${doc.author}</span>
            </div>
          </div>
          <div class="content">
            ${sectionsHtml}
          </div>
          <div class="footer-box">
            تم إنشاء وتنسيق هذا المستند آلياً بواسطة وكيل الذكاء الاصطناعي (Bogy DocuMaster Agent)
          </div>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', fullHtmlDoc], {
        type: 'application/msword;charset=utf-8',
      });

      const fileName = doc.fileName.endsWith('.docx') || doc.fileName.endsWith('.doc')
        ? doc.fileName
        : `${doc.fileName}.doc`;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      return true;
    } catch (error) {
      console.error('Failed to export Word file:', error);
      return false;
    }
  }

  // Export script (.ps1 or .bat)
  public static exportScript(content: string, fileName: string) {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      return true;
    } catch (error) {
      console.error('Failed to export script:', error);
      return false;
    }
  }

  // Trigger download of any text/file content
  public static triggerDownload(content: string, fileName: string, mimeType: string = 'text/plain') {
    try {
      const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      return true;
    } catch (error) {
      console.error('Failed to trigger download:', error);
      return false;
    }
  }
}
