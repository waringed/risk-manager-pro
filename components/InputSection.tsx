import React from 'react';
import { RiskInputs } from '../types';
import { WIN_RATES } from '../constants';
import { Settings, DollarSign, Percent, BarChart3, Target, HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface InputSectionProps {
  inputs: RiskInputs;
  onChange: (newInputs: RiskInputs) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ inputs, onChange }) => {
  const handleChange = (field: keyof RiskInputs, value: string) => {
    const numValue = parseFloat(value);
    onChange({
      ...inputs,
      [field]: isNaN(numValue) ? 0 : numValue,
    });
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
      <div className="flex items-center gap-2 mb-6 text-indigo-400">
        <Settings className="w-5 h-5" />
        <h2 className="text-lg font-semibold text-white">Parámetros de Configuración</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        
        {/* Reference Win Rate Selector */}
        <div className="space-y-2 pb-4 border-b border-slate-700">
          <Tooltip content="Define qué porcentaje de aciertos usar para calcular la 'Racha Máxima' principal y resaltar la fila en la tabla.">
            <label className="text-sm font-bold text-indigo-300 flex items-center gap-2 hover:text-indigo-200 transition-colors">
              <Target className="w-4 h-4" />
              Win Rate de Referencia
              <HelpCircle className="w-3 h-3 opacity-50" />
            </label>
          </Tooltip>
          <select
            value={inputs.referenceWinRate}
            onChange={(e) => handleChange('referenceWinRate', e.target.value)}
            className="w-full bg-indigo-900/20 border border-indigo-500/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer"
          >
            {WIN_RATES.map((rate) => (
              <option key={rate} value={rate} className="bg-slate-800">
                {rate}% Efectividad
              </option>
            ))}
          </select>
        </div>

        {/* Total Trades */}
        <div className="space-y-2">
          <Tooltip content="Número total de operaciones simuladas. A mayor muestra, mayor probabilidad estadística de sufrir rachas largas.">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2 hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              Muestra Total de Operaciones (T)
              <HelpCircle className="w-3 h-3 opacity-50" />
            </label>
          </Tooltip>
          <input
            type="number"
            value={inputs.totalTrades}
            onChange={(e) => handleChange('totalTrades', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            min="1"
          />
          <input 
             type="range" 
             min="100" 
             max="5000" 
             step="50"
             value={inputs.totalTrades}
             onChange={(e) => handleChange('totalTrades', e.target.value)}
             className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Initial Capital */}
        <div className="space-y-2">
           <Tooltip content="El balance inicial de dinero disponible en tu cuenta antes de empezar a operar.">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2 hover:text-white transition-colors">
              <DollarSign className="w-4 h-4 text-slate-400" />
              Capital Inicial (C)
              <HelpCircle className="w-3 h-3 opacity-50" />
            </label>
          </Tooltip>
          <input
            type="number"
            value={inputs.initialCapital}
            onChange={(e) => handleChange('initialCapital', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            min="0"
          />
        </div>

        {/* Risk Per Trade */}
        <div className="space-y-2">
          <Tooltip content="El porcentaje de tu capital actual que estás dispuesto a perder en una sola operación.">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2 hover:text-white transition-colors">
              <Percent className="w-4 h-4 text-slate-400" />
              Riesgo por Operación (R%)
              <HelpCircle className="w-3 h-3 opacity-50" />
            </label>
          </Tooltip>
          <div className="relative">
            <input
              type="number"
              value={inputs.riskPerTrade}
              onChange={(e) => handleChange('riskPerTrade', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              step="0.1"
              min="0.1"
              max="100"
            />
          </div>
          <input 
             type="range" 
             min="0.1" 
             max="10" 
             step="0.1"
             value={inputs.riskPerTrade}
             onChange={(e) => handleChange('riskPerTrade', e.target.value)}
             className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Max Acceptable Loss */}
        <div className="space-y-2">
          <Tooltip content="El límite de pérdida total (Drawdown) tras el cual considerarías que tu cuenta está 'quebrada' o dejarías de operar.">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2 hover:text-red-300 transition-colors">
              <Percent className="w-4 h-4 text-red-400" />
              Pérdida Máxima Aceptable (PMA%)
              <HelpCircle className="w-3 h-3 opacity-50" />
            </label>
          </Tooltip>
          <div className="relative">
            <input
              type="number"
              value={inputs.maxAcceptableLoss}
              onChange={(e) => handleChange('maxAcceptableLoss', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
              min="1"
              max="99"
            />
          </div>
          <input 
             type="range" 
             min="5" 
             max="95" 
             step="1"
             value={inputs.maxAcceptableLoss}
             onChange={(e) => handleChange('maxAcceptableLoss', e.target.value)}
             className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>
      </div>
    </div>
  );
};