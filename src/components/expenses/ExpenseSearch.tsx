import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';

interface ExpenseSearchProps {
  onSearch: (searchTerm: string) => void;
}

export function ExpenseSearch({ onSearch }: ExpenseSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <Input
        label="Search Expenses"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by description..."
      />
    </div>
  );
}
