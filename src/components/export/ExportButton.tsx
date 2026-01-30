'use client';

import { useState } from 'react';
import { Expense } from '@/types/expense';
import { Button } from '@/components/ui/Button';
import { ExportHub } from './ExportHub';

interface ExportButtonProps {
  expenses: Expense[];
}

export function ExportButton({ expenses }: ExportButtonProps) {
  const [isHubOpen, setIsHubOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsHubOpen(true)}
        disabled={expenses.length === 0}
        className="relative"
      >
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
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        Export Hub
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      </Button>

      <ExportHub
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        expenses={expenses}
      />
    </>
  );
}
