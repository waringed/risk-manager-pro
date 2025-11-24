import React, { useRef, useEffect } from 'react';
import { StreakRow } from '../types';
import { TrendingDown, MousePointerClick, HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface StreakTableProps {
  rows: StreakRow[];
  referenceWinRate: number;
  onSelectWinRate: (rate: number) => void;
}

export const StreakTable: React.FC<StreakTableProps> = ({ rows, referenceWinRate, onSelectWinRate }) => {
  const activeRowRef = useRef<HTMLTableRowElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the active row within the container ONLY (prevents page jump)
  useEffect(() => {
    if (activeRowRef.current && tableContainerRef.current) {
      const container = tableContainerRef.current;
      const row = activeRowRef.current;

      // Calculate the position to center the row inside the container
      // offsetTop is relative to the closest positioned ancestor (the table or container)
      const rowTop = row.offsetTop;
      const rowHeight = row.clientHeight;
      const containerHeight = container.clientHeight;

      // Desired scroll position: Row in the middle
      const scrollTo = rowTop - (containerHeight / 2) + (rowHeight / 2);

      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth',
      });
    }
  }, [referenceWinRate]);

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 flex flex-col h-full relative">
      {/* Header: Removed overflow hidden from parent, so we round top corners here */}
      <div className="p-5 border-b border-slate-700 flex items-center justify-between bg-slate-800/50 rounded-t-xl relative z-20">
        <Tooltip content="Muestra la racha de pérdidas esperada (N) para diferentes niveles de efectividad (Win Rate) dentro de la muestra de operaciones definida.">
          <div className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors cursor-help">
            <TrendingDown className="w-5 h-5" />
            <h3 className="font-semibold text-white flex items-center gap-2">
              Racha Máxima Esperada
              <HelpCircle className="w-3 h-3 opacity-50" />
            </h3>
          </div>
        </Tooltip>
        <div className="flex items-center gap-2">
             <MousePointerClick className="w-3 h-3 text-slate-500" />
             <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">Click para seleccionar</span>
        </div>
      </div>
      
      {/* Scrollable area needs overflow-hidden for the scrollbar to stay inside rounded corners, 
          but since we removed it from parent, we apply rounded-b-xl here */}
      <div 
        ref={tableContainerRef}
        className="overflow-y-auto flex-1 custom-scrollbar rounded-b-xl relative z-10"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 sticky top-0 shadow-sm">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Win Rate (%)</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Racha (N)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {rows.map((row) => {
              const isReference = row.winRate === referenceWinRate;
              return (
                <tr 
                  key={row.winRate}
                  ref={isReference ? activeRowRef : null}
                  onClick={() => onSelectWinRate(row.winRate)}
                  className={`cursor-pointer transition-all duration-200 ${
                    isReference 
                      ? 'bg-indigo-900/30 border-l-4 border-l-indigo-500' 
                      : 'hover:bg-slate-700/50 border-l-4 border-l-transparent'
                  }`}
                >
                  <td className={`p-4 text-sm ${isReference ? 'font-bold text-indigo-300' : 'text-slate-300'}`}>
                    {row.winRate}%
                  </td>
                  <td className={`p-4 text-sm font-mono text-right ${isReference ? 'font-bold text-indigo-300' : 'text-slate-200'}`}>
                    {row.expectedStreak}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
