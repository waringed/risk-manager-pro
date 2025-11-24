import React from 'react';
import { FinancialImpact } from '../types';
import { AlertTriangle, DollarSign, Skull, HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface SummaryCardsProps {
  data: FinancialImpact;
  referenceWinRate: number;
  initialCapital: number;
  maxAcceptableLoss: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  data, 
  referenceWinRate,
  initialCapital, 
  maxAcceptableLoss 
}) => {
  
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate exact monetary value of the max acceptable loss
  const maxLossAmount = initialCapital * (maxAcceptableLoss / 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* Card 1: Max Expected Streak */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg relative group">
        {/* Background Decoration Container - Isolated Clipping */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
           <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        </div>

        {/* Content - No Overflow Hidden allowed here so Tooltips can pop out */}
        <div className="relative z-10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <Tooltip content="Cantidad estadística de pérdidas consecutivas altamente probables para tu Win Rate dentro de la muestra definida.">
              <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2 hover:text-slate-200 transition-colors cursor-help">
                Máxima Racha (N)
                <HelpCircle className="w-3 h-3 opacity-50" />
              </h3>
            </Tooltip>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{data.streakDuration}</span>
            <span className="text-xs text-slate-500 mb-1">pérdidas seguidas</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Calculado al <span className="text-indigo-400 font-semibold">{referenceWinRate}%</span> Win Rate</p>
        </div>
      </div>

      {/* Card 2: Monetary Impact */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg relative group">
        {/* Background Decoration Container */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
           <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        </div>

        <div className="relative z-10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <Tooltip content="Dinero real estimado que perderías si ocurre la racha esperada, calculado con interés compuesto negativo (cada pérdida reduce el capital base).">
              <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2 hover:text-slate-200 transition-colors cursor-help">
                Pérdida Monetaria (IDR)
                <HelpCircle className="w-3 h-3 opacity-50" />
              </h3>
            </Tooltip>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{formatMoney(data.monetaryImpact)}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Impacto tras {data.streakDuration} pérdidas</p>
        </div>
      </div>

      {/* Card 3: Bankruptcy Streak */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg relative group">
        {/* Background Decoration Container */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        </div>

        <div className="relative z-10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
              <Skull className="w-5 h-5" />
            </div>
            <Tooltip content="Número exacto de pérdidas consecutivas necesarias para perder el porcentaje de PMA% definido y 'quemar' la cuenta según tus reglas.">
              <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2 hover:text-slate-200 transition-colors cursor-help">
                Racha de Quiebra (RSL)
                <HelpCircle className="w-3 h-3 opacity-50" />
              </h3>
            </Tooltip>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{data.survivableStreak}</span>
            <span className="text-xs text-slate-500 mb-1">pérdidas</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Hasta perder <span className="text-red-400 font-semibold">{formatMoney(maxLossAmount)}</span> ({maxAcceptableLoss}%)
          </p>
        </div>
      </div>
    </div>
  );
};