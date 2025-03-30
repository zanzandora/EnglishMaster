import { useState } from 'react';

export const useSort = <T extends string>(defaultField: T) => {
  const [sortConfig, setSortConfig] = useState<{
    field: T;
    order: 'asc' | 'desc' | null;
  }>({ field: defaultField, order: null });

  const handleSort = (field: T) => {
    setSortConfig((prev) => {
      // Reset nếu chọn field mới
      if (prev.field !== field) {
        return { field, order: 'asc' };
      }
      return {
        field,
        order:
          prev.order === 'asc' ? 'desc' : prev.order === 'desc' ? null : 'asc',
      };
    });
  };

  const getSortIcon = () => {
    if (!sortConfig.order) return '/sort.png';
    return sortConfig.order === 'asc' ? '/sort-asc.png' : '/sort-desc.png';
  };

  return { sortConfig, handleSort, getSortIcon };
};
