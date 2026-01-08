'use client';

import type { CalibrationRun } from '@/types/calibrax';
import { DataCard } from '../ui/DataCard';
import { InfoRow } from '../ui/InfoRow';

interface MetadataViewProps {
  run: CalibrationRun;
  onCopy: (text: string) => void;
  copied: boolean;
}

export function MetadataView({ run }: MetadataViewProps) {
  return (
    <div className="space-y-4">
      <DataCard title="Calibration Info" icon="📋">
        <InfoRow label="Name" value={run.cron_data.name} />
        <InfoRow label="Model" value={run.cron_data.modell} />
        <InfoRow label="Prompts" value={run.cron_data.anzahl.toString()} />
        <InfoRow label="Cron ID" value={run.cron_id} />
      </DataCard>
      
      <DataCard title="Field Weights" icon="⚖️">
        {Object.entries(run.cron_data.felder).map(([field, weight]) => (
          <InfoRow key={field} label={field} value={weight.toString()} />
        ))}
      </DataCard>
      
      <DataCard title="Result Stats" icon="📊">
        <InfoRow label="Generated" value={run.result.generated.toString()} />
        <InfoRow label="Failed" value={run.result.failed.toString()} />
        <InfoRow label="Status" value={run.result.status} />
      </DataCard>
    </div>
  );
}
