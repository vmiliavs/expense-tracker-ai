import { Expense } from '@/types/expense';

export function exportToCSV(expenses: Expense[]): void {
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

  // Create CSV content
  const csvContent = csvRows.join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  // Generate filename with current date
  const filename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
