import React from 'react';
import { FinancialImpact } from '../types';
import { CheckCircle, AlertCircle, ShieldAlert, HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface RiskAnalysisProps {
  data: FinancialImpact;
  initialCapital: number;
  maxAcceptableLoss: number;
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ data, initialCapital, maxAcceptableLoss }) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const margin = data.survivableStreak - data.streakDuration;
  const isSafe = margin > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Message 1: Robustness / Financial Impact */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 flex gap-4">
        <div className="flex-shrink-0 mt-1">
           <div className="bg-blue-500/20 p-2 rounded-full">
             <AlertCircle className="w-5 h-5 text-blue-400" />
           </div>
        </div>
        <div>
          <Tooltip content="Evalúa cuánto daño causaría la racha esperada en términos monetarios y porcentuales sobre tu cuenta actual.">
            <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2 w-fit hover:text-blue-300 transition-colors">
              Análisis de Impacto Financiero
              <HelpCircle className="w-3 h-3 opacity-50" />
            </h4>
          </Tooltip>
          <p className="text-sm text-slate-300 leading-relaxed">
            La racha máxima esperada de <strong className="text-white">{data.streakDuration} pérdidas</strong> resultaría en una reducción de capital de <strong className="text-white">{formatMoney(data.monetaryImpact)}</strong>. 
            Esto representa aproximadamente el <strong className="text-white">{((data.monetaryImpact/initialCapital)*100).toFixed(1)}%</strong> de tu cuenta total.
          </p>
        </div>
      </div>

      {/* Message 2: Safety Margin */}
      <div className={`bg-slate-800/50 border rounded-lg p-5 flex gap-4 ${isSafe ? 'border-green-900/50 bg-green-900/10' : 'border-red-900/50 bg-red-900/10'}`}>
        <div className="flex-shrink-0 mt-1">
           <div className={`${isSafe ? 'bg-green-500/20' : 'bg-red-500/20'} p-2 rounded-full`}>
             {isSafe ? <CheckCircle className="w-5 h-5 text-green-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
           </div>
        </div>
        <div>
          <Tooltip content="Compara tu racha esperada contra tu límite de quiebra. Si tienes margen positivo (más balas de las que necesitas), el sistema es seguro.">
            <h4 className={`text-sm font-semibold mb-1 flex items-center gap-2 w-fit transition-colors ${isSafe ? 'text-green-300 hover:text-green-200' : 'text-red-300 hover:text-red-200'}`}>
              {isSafe ? 'Zona de Seguridad' : 'Alerta de Riesgo'}
              <HelpCircle className="w-3 h-3 opacity-50" />
            </h4>
          </Tooltip>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tu sistema puede soportar <strong className="text-white">{data.survivableStreak} pérdidas</strong> consecutivas antes de alcanzar tu límite de quiebra del {maxAcceptableLoss}%. 
            {isSafe 
              ? <span> La racha esperada de {data.streakDuration} está <strong className="text-green-400">dentro de los parámetros seguros</strong> con un margen de {margin} operaciones extra.</span>
              : <span> <strong className="text-red-400">Cuidado:</strong> La racha esperada está peligrosamente cerca de tu límite de tolerancia.</span>
            }
          </p>
        </div>
      </div>
    </div>
  );
};