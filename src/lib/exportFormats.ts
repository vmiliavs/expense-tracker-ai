import { jsPDF } from 'jspdf';
import { Expense } from '@/types/expense';
import { calculateSummary } from './calculations';
import { formatCurrency, formatDate } from './formatters';

/**
 * Shared utility to download a file
 */
function downloadFile(blob: Blob, filename: string): void {
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

/**
 * Export expenses to CSV format
 */
export function exportToCSV(expenses: Expense[], filename?: string): void {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  // Create CSV header
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  const csvRows = [headers.join(',')];

  // Add data rows
  expenses.forEach((expense) => {
    const row = [
      expense.date,
      expense.category,
      expense.amount.toString(),
      `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes in description
    ];
    csvRows.push(row.join(','));
  });

  // Create blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const defaultFilename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;

  downloadFile(blob, filename || defaultFilename);
}

/**
 * Export expenses to JSON format with metadata and summary
 */
export function exportToJSON(expenses: Expense[], filename?: string): void {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  const summary = calculateSummary(expenses);

  // Find date range
  const dates = expenses.map(e => new Date(e.date).getTime());
  const earliest = new Date(Math.min(...dates)).toISOString().split('T')[0];
  const latest = new Date(Math.max(...dates)).toISOString().split('T')[0];

  // Build JSON structure
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      version: '1.0',
      totalRecords: expenses.length,
      totalAmount: summary.totalSpending,
      dateRange: {
        earliest,
        latest,
      },
    },
    summary: {
      totalSpending: summary.totalSpending,
      monthlySpending: summary.monthlySpending,
      expenseCount: summary.expenseCount,
      categoryBreakdown: summary.categoryBreakdown,
    },
    expenses: expenses.map(expense => ({
      date: expense.date,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
    })),
  };

  // Create blob and download
  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const defaultFilename = `expenses-${new Date().toISOString().split('T')[0]}.json`;

  downloadFile(blob, filename || defaultFilename);
}

/**
 * Export expenses to PDF format with formatted report
 */
export function exportToPDF(expenses: Expense[], filename?: string): void {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  const summary = calculateSummary(expenses);
  const doc = new jsPDF();

  let yPosition = 20;
  const pageHeight = 280;
  const leftMargin = 20;
  let pageNumber = 1;

  // Helper function to add page numbers
  const addPageNumber = () => {
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${pageNumber}`, 105, 290, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    pageNumber++;
  };

  // Helper function to check if new page is needed
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight) {
      addPageNumber();
      doc.addPage();
      yPosition = 20;
    }
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('EXPENSE REPORT', leftMargin, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${formatDate(new Date().toISOString().split('T')[0], 'long')}`, leftMargin, yPosition);
  yPosition += 7;
  doc.text(`Total Expenses: ${expenses.length}`, leftMargin, yPosition);
  yPosition += 7;
  doc.text(`Total Amount: ${formatCurrency(summary.totalSpending)}`, leftMargin, yPosition);
  yPosition += 15;

  // Table header
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Date', leftMargin, yPosition);
  doc.text('Category', leftMargin + 35, yPosition);
  doc.text('Amount', leftMargin + 90, yPosition);
  doc.text('Description', leftMargin + 120, yPosition);
  yPosition += 3;

  // Draw line under header
  doc.setDrawColor(200, 200, 200);
  doc.line(leftMargin, yPosition, 190, yPosition);
  yPosition += 7;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  expenses.forEach((expense) => {
    checkNewPage(10);

    // Format date to MM/DD/YY
    const dateObj = new Date(expense.date);
    const shortDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getFullYear()).slice(-2)}`;

    doc.text(shortDate, leftMargin, yPosition);
    doc.text(expense.category, leftMargin + 35, yPosition);
    doc.text(formatCurrency(expense.amount), leftMargin + 90, yPosition);

    // Truncate description if too long
    const maxDescriptionLength = 35;
    const description = expense.description.length > maxDescriptionLength
      ? expense.description.substring(0, maxDescriptionLength) + '...'
      : expense.description;
    doc.text(description, leftMargin + 120, yPosition);

    yPosition += 7;
  });

  // Summary section
  checkNewPage(60);
  yPosition += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Summary by Category', leftMargin, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  // Sort categories by amount (descending)
  const categoryEntries = Object.entries(summary.categoryBreakdown)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a);

  categoryEntries.forEach(([category, amount]) => {
    checkNewPage(8);
    const percentage = ((amount / summary.totalSpending) * 100).toFixed(1);
    doc.text(`${category}: ${formatCurrency(amount)} (${percentage}%)`, leftMargin + 5, yPosition);
    yPosition += 7;
  });

  // Add final page number
  addPageNumber();

  // Save PDF
  const defaultFilename = `expenses-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename || defaultFilename);
}
