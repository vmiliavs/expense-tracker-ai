import { Expense } from '@/types/expense';
import { exportToCSV } from '@/lib/export';
import { Button } from '@/components/ui/Button';

interface ExportButtonProps {
  expenses: Expense[];
}

export function ExportButton({ expenses }: ExportButtonProps) {
  const handleExport = () => {
    exportToCSV(expenses);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={expenses.length === 0}
    >
      Export Data
    </Button>
  );
}
