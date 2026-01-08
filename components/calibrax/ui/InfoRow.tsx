'use client';

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
      <span className="text-sm text-gray-500 font-mono">{label}</span>
      <span className="text-sm text-white font-mono">{value}</span>
    </div>
  );
}
