import * as XLSX from 'xlsx';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { ExcelSheetData, WordDocumentData } from '../types/agent';

export class FileExportService {
  // Export Excel (.xlsx / .csv) file using SheetJS
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
      XLSX.utils.book_append_sheet(workbook, worksheet, data.sheetName || 'BogyReport');

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

  // Export Real Microsoft Word (.docx) file using the official 'docx' package
  public static async exportToWord(doc: WordDocumentData): Promise<boolean> {
    try {
      const children: any[] = [];

      // Document Title
      children.push(
        new Paragraph({
          text: doc.title,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
        })
      );

      // Subtitle if available
      if (doc.subtitle) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: doc.subtitle,
                italics: true,
                color: '0369a1',
                size: 24,
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 300 },
          })
        );
      }

      // Metadata Info
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `المؤلف: ${doc.author}   |   التاريخ: ${doc.date || new Date().toLocaleDateString('ar-EG')}`,
              color: '64748b',
              size: 20,
            }),
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 400 },
        })
      );

      // Document Sections
      for (const sec of doc.sections) {
        children.push(
          new Paragraph({
            text: sec.heading,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.RIGHT,
            spacing: { before: 300, after: 150 },
          })
        );

        const paragraphs = sec.content.split('\n');
        for (const p of paragraphs) {
          if (p.trim()) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: p.trim(),
                    size: 22,
                    color: '1e293b',
                  }),
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 150, line: 360 },
              })
            );
          }
        }
      }

      // Footer notice
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '— صُنع بواسطة برنامج وكلاء بوجي للذكاء الاصطناعي (Bogy Agents AI Swarm OS) —',
              italics: true,
              color: '94a3b8',
              size: 18,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 500 },
        })
      );

      const wordDoc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440,
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(wordDoc);
      const fileName = doc.fileName.endsWith('.docx') ? doc.fileName : `${doc.fileName}.docx`;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      return true;
    } catch (error) {
      console.error('Failed to export real Word .docx:', error);
      // Fallback to HTML-based doc download
      return this.fallbackExportWordHtml(doc);
    }
  }

  // Fallback HTML-based docx download
  private static fallbackExportWordHtml(doc: WordDocumentData): boolean {
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
          </style>
        </head>
        <body>
          <div class="header-box">
            <h1 class="title">${doc.title}</h1>
            ${doc.subtitle ? `<p style="font-size: 14pt; color: #0284c7; margin-bottom: 15px;">${doc.subtitle}</p>` : ''}
            <div class="meta">
              <span>المعدّ: <b>${doc.author}</b></span> | 
              <span>التاريخ: ${doc.date}</span>
            </div>
          </div>
          ${sectionsHtml}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', fullHtmlDoc], {
        type: 'application/msword',
      });

      const fileName = doc.fileName.endsWith('.docx') ? doc.fileName : `${doc.fileName}.docx`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      return true;
    } catch (e) {
      console.error('Fallback word export failed:', e);
      return false;
    }
  }

  // Trigger download of text or script file
  public static triggerDownload(content: string, filename: string, mimeType = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Export script helper alias
  public static exportScript(content: string, filename: string) {
    this.triggerDownload(content, filename);
  }
}
