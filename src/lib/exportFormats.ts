import { Expense } from '@/types/expense';
import jsPDF from 'jspdf';

export type ExportFormat = 'csv' | 'json' | 'pdf';

interface ExportOptions {
  filename: string;
  format: ExportFormat;
}

// CSV Export
export function exportToCSV(expenses: Expense[], filename: string): void {
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  const csvRows = [headers.join(',')];

  expenses.forEach((expense) => {
    const row = [
      expense.date,
      expense.category,
      expense.amount.toFixed(2),
      `"${expense.description.replace(/"/g, '""')}"`,
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

// JSON Export
export function exportToJSON(expenses: Expense[], filename: string): void {
  const jsonData = {
    exportDate: new Date().toISOString(),
    totalRecords: expenses.length,
    expenses: expenses.map(expense => ({
      date: expense.date,
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
    })),
  };

  const jsonContent = JSON.stringify(jsonData, null, 2);
  downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
}

// PDF Export
export function exportToPDF(expenses: Expense[], filename: string): void {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text('Expense Report', 14, 20);

  // Metadata
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.text(`Total Records: ${expenses.length}`, 14, 34);

  // Calculate total
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  doc.text(`Total Amount: $${total.toFixed(2)}`, 14, 40);

  // Table header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  let yPos = 50;
  doc.text('Date', 14, yPos);
  doc.text('Category', 50, yPos);
  doc.text('Amount', 100, yPos);
  doc.text('Description', 130, yPos);

  // Draw header line
  doc.line(14, yPos + 2, 195, yPos + 2);

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos += 8;

  expenses.forEach((expense) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;

      // Redraw header on new page
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Date', 14, yPos);
      doc.text('Category', 50, yPos);
      doc.text('Amount', 100, yPos);
      doc.text('Description', 130, yPos);
      doc.line(14, yPos + 2, 195, yPos + 2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      yPos += 8;
    }

    doc.text(expense.date, 14, yPos);
    doc.text(expense.category, 50, yPos);
    doc.text(`$${expense.amount.toFixed(2)}`, 100, yPos);

    // Truncate long descriptions
    const maxDescLength = 30;
    const desc = expense.description.length > maxDescLength
      ? expense.description.substring(0, maxDescLength) + '...'
      : expense.description;
    doc.text(desc, 130, yPos);

    yPos += 7;
  });

  // Save PDF
  doc.save(filename);
}

// Generic export function
export function exportExpenses(
  expenses: Expense[],
  options: ExportOptions
): void {
  const { filename, format } = options;

  switch (format) {
    case 'csv':
      exportToCSV(expenses, filename);
      break;
    case 'json':
      exportToJSON(expenses, filename);
      break;
    case 'pdf':
      exportToPDF(expenses, filename);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Helper function to trigger download
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
