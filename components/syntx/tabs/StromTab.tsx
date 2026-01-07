'use client';

import { TopicFieldPulse } from '@/components/core/TopicFieldPulse';
import { StromDispatcher } from '@/components/core/StromDispatcher';
import { Database, Zap, Activity } from 'lucide-react';

export function StromTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-3">
          🌊 STROM ORCHESTRATOR
        </h2>
        <p className="text-gray-400 text-lg">Live Field Control • Topic Bubbles • Prompt Generation</p>
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400">34 Topics Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-purple-400">7 Kategorien</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <span className="text-pink-400">4 Styles</span>
          </div>
        </div>
      </div>

      {/* Topic Field Pulse */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">TOPIC FIELD PULSE</h3>
            <p className="text-gray-400 text-sm">Drag, click, weight • Live from API</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
              <span className="text-cyan-400 text-xs font-bold">LIVE DATA</span>
            </div>
            <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
              <span className="text-green-400 text-xs font-bold">API: dev.syntx-system.com</span>
            </div>
          </div>
        </div>
        <TopicFieldPulse language="de" />
      </div>

      {/* Strom Dispatcher */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">PROMPT GENERATOR</h3>
            <p className="text-gray-400 text-sm">GPT-4 Integration • Live Dispatch</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg">
              <span className="text-orange-400 text-xs font-bold">⚠️ COSTS REAL $$$</span>
            </div>
          </div>
        </div>
        <StromDispatcher />
      </div>

      {/* Info Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 rounded-xl border border-cyan-500/30">
          <div className="flex items-center space-x-3 mb-3">
            <Database className="w-8 h-8 text-cyan-400" />
            <div className="text-cyan-400 font-bold text-lg">LIVE API</div>
          </div>
          <div className="text-gray-300 text-sm leading-relaxed">
            Alle Daten kommen direkt von <span className="text-cyan-400 font-mono text-xs">dev.syntx-system.com/api/strom</span>. 
            Keine Mocks. Echte Topics. Echte Kategorien. Echtzeit.
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="w-8 h-8 text-purple-400" />
            <div className="text-purple-400 font-bold text-lg">MULTI-LANGUAGE</div>
          </div>
          <div className="text-gray-300 text-sm leading-relaxed">
            Kategorien & Styles in <span className="text-purple-400 font-bold">DE • EN • RU</span>. 
            Definiert in <span className="font-mono text-xs">data/kategorien.json</span>. 
            224 Zeilen pure Config.
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-xl border border-green-500/30">
          <div className="flex items-center space-x-3 mb-3">
            <Activity className="w-8 h-8 text-green-400" />
            <div className="text-green-400 font-bold text-lg">PRODUCTION</div>
          </div>
          <div className="text-gray-300 text-sm leading-relaxed">
            System läuft auf <span className="text-green-400 font-bold">Port 8020</span>. 
            Nginx geroutet. SSL secured. Systemd managed. 
            <span className="text-green-400">✓ STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import LiveQueueOverview from '@/components/krontun/LiveQueueOverview';

// Füge in den Tab ein:
// <LiveQueueOverview />
