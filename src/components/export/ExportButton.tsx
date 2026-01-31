import React, { useState } from 'react';
import { Expense } from '@/types/expense';
import { Button } from '@/components/ui/Button';
import { ExportModal } from './ExportModal';

interface ExportButtonProps {
  expenses: Expense[];
}

export function ExportButton({ expenses }: ExportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleOpenModal} disabled={expenses.length === 0}>
        <svg
          className="w-4 h-4 mr-2 inline"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export Data
      </Button>

      <ExportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        expenses={expenses}
      />
    </>
  );
}
