import { useState, useEffect } from 'react';
import { Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { Select } from '@shared/ui/Select';

export const ProjectSearch = ({ onSearch, filters = {} }) => {
  const [status, setStatus] = useState(filters.status || 'OPEN');
  const [minBudget, setMinBudget] = useState(filters.minBudget || '');
  const [maxBudget, setMaxBudget] = useState(filters.maxBudget || '');

  useEffect(() => {
    setStatus(filters.status || 'OPEN');
    setMinBudget(filters.minBudget || '');
    setMaxBudget(filters.maxBudget || '');
  }, [filters]);

  const statusOptions = [
    { value: 'OPEN', label: 'Open' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  const applyFilters = () => {
    onSearch({
      status,
      categoryId: null,
      minBudget: minBudget ? parseFloat(minBudget) : null,
      maxBudget: maxBudget ? parseFloat(maxBudget) : null,
      tagIds: [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    onSearch({
      status: value,
      categoryId: null,
      minBudget: minBudget ? parseFloat(minBudget) : null,
      maxBudget: maxBudget ? parseFloat(maxBudget) : null,
      tagIds: [],
    });
  };

  const handleClear = () => {
    setStatus('OPEN');
    setMinBudget('');
    setMaxBudget('');
    onSearch({
      status: 'OPEN',
      categoryId: null,
      minBudget: null,
      maxBudget: null,
      tagIds: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          label="Status"
          value={status}
          onChange={handleStatusChange}
          options={statusOptions}
          placeholder="Select status"
        />
        <Input
          label="Min Budget"
          type="number"
          step="0.01"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
          placeholder="0.00"
        />
        <Input
          label="Max Budget"
          type="number"
          step="0.01"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          placeholder="0.00"
        />
        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1">Search</Button>
          <Button type="button" variant="ghost" onClick={handleClear}>Clear</Button>
        </div>
      </div>
    </form>
  );
};

