import { useState, useEffect } from 'react';
import { Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { Select } from '@shared/ui/Select';
import { DatePicker } from '@shared/ui/DatePicker';

export const ProjectSearch = ({ onSearch, filters = {} }) => {
  const [status, setStatus] = useState(filters.status || 'ALL');
  const [minBudget, setMinBudget] = useState(filters.minBudget || '');
  const [maxBudget, setMaxBudget] = useState(filters.maxBudget || '');
  const [minDeadline, setMinDeadline] = useState(filters.minDeadline || '');
  const [maxDeadline, setMaxDeadline] = useState(filters.maxDeadline || '');

  useEffect(() => {
    setStatus(filters.status || 'ALL');
    setMinBudget(filters.minBudget || '');
    setMaxBudget(filters.maxBudget || '');
    setMinDeadline(filters.minDeadline || '');
    setMaxDeadline(filters.maxDeadline || '');
  }, [filters]);

  const statusOptions = [
    { value: 'ALL', label: 'All' },
    { value: 'OPEN', label: 'Open' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  const applyFilters = () => {
    onSearch({
      status: status === 'ALL' ? null : status,
      categoryId: null,
      minBudget: minBudget ? parseFloat(minBudget) : null,
      maxBudget: maxBudget ? parseFloat(maxBudget) : null,
      tagIds: [],
      minDeadline: minDeadline ? new Date(minDeadline).toISOString() : null,
      maxDeadline: maxDeadline ? new Date(maxDeadline).toISOString() : null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    onSearch({
      status: value === 'ALL' ? null : value,
      categoryId: null,
      minBudget: minBudget ? parseFloat(minBudget) : null,
      maxBudget: maxBudget ? parseFloat(maxBudget) : null,
      tagIds: [],
      minDeadline: minDeadline ? new Date(minDeadline).toISOString() : null,
      maxDeadline: maxDeadline ? new Date(maxDeadline).toISOString() : null,
    });
  };

  const handleClear = () => {
    setStatus('ALL');
    setMinBudget('');
    setMaxBudget('');
    setMinDeadline('');
    setMaxDeadline('');
    onSearch({
      status: null,
      categoryId: null,
      minBudget: null,
      maxBudget: null,
      tagIds: [],
      minDeadline: null,
      maxDeadline: null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
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
        <DatePicker
          label="Min Deadline"
          value={minDeadline}
          onChange={(date) => setMinDeadline(date)}
          placeholder="Select date"
        />
        <DatePicker
          label="Max Deadline"
          value={maxDeadline}
          onChange={(date) => setMaxDeadline(date)}
          placeholder="Select date"
        />
        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1">Search</Button>
          <Button type="button" variant="ghost" onClick={handleClear}>Clear</Button>
        </div>
      </div>
    </form>
  );
};

