'use client';

import { FieldDataGrid } from '@/components/syntx/field-datagrid';

interface Field {
  id: string;
  topic: string;
  content: string;
  style: string;
  score: number;
  timestamp: string;
  cost_field: number;
}

interface DataGridTabProps {
  fields: Field[];
  isLoading: boolean;
  onFieldSelect: (field: Field | null) => void;
}

export function DataGridTab({ fields, isLoading, onFieldSelect }: DataGridTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Field DataGrid</h2>
        <p className="text-gray-400">Complete overview of all {fields.length} fields</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading...</div>
        </div>
      ) : (
        <FieldDataGrid fields={fields} onFieldSelect={onFieldSelect} />
      )}
    </div>
  );
}
