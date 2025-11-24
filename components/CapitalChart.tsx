import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface CapitalChartProps {
  initialCapital: number;
  riskPerTrade: number;
  maxStreak: number;
  survivableStreak: number;
  maxAcceptableLoss: number;
}

export const CapitalChart: React.FC<CapitalChartProps> = ({
  initialCapital,
  riskPerTrade,
  maxStreak,
  survivableStreak,
  maxAcceptableLoss
}) => {
  
  // Generate data points for the chart
  // We want to show enough points to cover the survivable streak + some buffer
  const pointsToShow = Math.max(20, Math.floor(survivableStreak * 1.2));
  const data = Array.from({ length: pointsToShow }, (_, i) => {
    const currentStreak = i;
    const remaining = initialCapital * Math.pow(1 - (riskPerTrade / 100), currentStreak);
    const drawdown = ((initialCapital - remaining) / initialCapital) * 100;
    return {
      streak: currentStreak,
      capital: remaining,
      drawdown: drawdown
    };
  });

  const pmaValue = initialCapital * (1 - (maxAcceptableLoss / 100));

  return (
    <div className="h-full min-h-[300px] w-full bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg flex flex-col">
      <Tooltip content="Gráfico de decaimiento exponencial que muestra cómo se reduce tu capital tras cada pérdida consecutiva, visualizando dónde cae tu racha esperada frente al límite de quiebra.">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 ml-2 flex items-center gap-2 w-fit hover:text-white transition-colors">
           Simulación de Decaimiento de Capital
           <HelpCircle className="w-3 h-3 opacity-50" />
        </h3>
      </Tooltip>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="streak" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              label={{ value: 'Pérdidas Consecutivas', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }} 
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickFormatter={(value) => `$${value}`} 
              tickLine={false}
              domain={[0, 'auto']}
            />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Capital']}
              labelFormatter={(label) => `Racha: ${label}`}
            />
            <ReferenceLine y={pmaValue} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Límite PMA', fill: '#ef4444', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine x={maxStreak} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'N Esperado', fill: '#f97316', fontSize: 10, position: 'insideTopRight' }} />
            
            <Area 
              type="monotone" 
              dataKey="capital" 
              stroke="#6366f1" 
              fillOpacity={1} 
              fill="url(#colorCapital)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};