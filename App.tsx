
import React, { useState, useMemo } from 'react';
import { RiskInputs, StreakRow, FinancialImpact } from './types';
import { DEFAULT_INPUTS, WIN_RATES } from './constants';
import { calculateStreakTable, calculateFinancialImpact, calculateExpectedStreak } from './utils/calculations';
import { InputSection } from './components/InputSection';
import { SummaryCards } from './components/SummaryCards';
import { StreakTable } from './components/StreakTable';
import { CapitalChart } from './components/CapitalChart';
import { RiskAnalysis } from './components/RiskAnalysis';
import { Glossary } from './components/Glossary';
import { Info, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<RiskInputs>(DEFAULT_INPUTS);

  // Logic Calculations
  const { tableData, impactData } = useMemo(() => {
    // 1. Generate Table of Streaks
    const tableData: StreakRow[] = calculateStreakTable(inputs.totalTrades, WIN_RATES);

    // 2. Find the streak for the selected reference win rate
    // We calculate it directly to ensure accuracy even if the user somehow selects a rate not in table (though UI prevents this currently)
    const referenceStreak = calculateExpectedStreak(inputs.totalTrades, inputs.referenceWinRate);

    // 3. Calculate Financial Impact based on that streak
    const impactData: FinancialImpact = calculateFinancialImpact(
      inputs.initialCapital,
      inputs.riskPerTrade,
      inputs.maxAcceptableLoss,
      referenceStreak
    );

    return { tableData, impactData };
  }, [inputs]);

  const handleWinRateSelect = (rate: number) => {
    setInputs(prev => ({
      ...prev,
      referenceWinRate: rate
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-12 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-28 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://global-files-nginx.builderall.com/0e184df7-813a-4af4-89e6-7f8094a855e1/ef6b703c3cb1d27fce2d6a3c1eef779fe760031f15a5a5082483cc423999dd6f.png" 
              alt="Waring Logo" 
              className="h-24 w-auto object-contain" 
            />
          </div>
          {/* Version and Docs link removed */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Branded Tool Name - Centered */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Risk <span className="text-emerald-500">Manager</span>
            </h2>
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-mono rounded uppercase tracking-wider font-semibold">
              PRO
            </span>
          </div>
          <p className="text-slate-400 max-w-4xl text-center mx-auto text-lg leading-relaxed">
            No dejes tu riesgo a la suerte al hacer trading. Calcula con precisión matemática tu exposición a las <span className="text-slate-200 font-medium">rachas negativas inevitables</span>, visualiza el impacto real en tu cuenta y ajusta para crecer a largo plazo.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <SummaryCards 
          data={impactData} 
          referenceWinRate={inputs.referenceWinRate}
          initialCapital={inputs.initialCapital}
          maxAcceptableLoss={inputs.maxAcceptableLoss}
        />

        {/* Automated Risk Analysis Messages */}
        <RiskAnalysis 
          data={impactData} 
          initialCapital={inputs.initialCapital} 
          maxAcceptableLoss={inputs.maxAcceptableLoss} 
        />

        {/* Main Grid Layout */}
        {/* Removed fixed height from parent grid to prevent overlap issues */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Inputs (3 cols) - Auto Height */}
          <div className="lg:col-span-3 w-full">
            <InputSection inputs={inputs} onChange={setInputs} />
            
            <div className="mt-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong>Nota Técnica:</strong> El cálculo de "Racha Máxima (N)" utiliza una proyección logarítmica estándar basada en la probabilidad de que ocurra una racha de pérdidas consecutivas dentro de una muestra de <em>{inputs.totalTrades}</em> operaciones.
                </p>
              </div>
            </div>
          </div>

          {/* Middle Column: Chart (6 cols) - Fixed Height for display */}
          <div className="lg:col-span-6 h-[400px] lg:h-[600px] w-full">
            <CapitalChart 
              initialCapital={inputs.initialCapital}
              riskPerTrade={inputs.riskPerTrade}
              maxStreak={impactData.streakDuration}
              survivableStreak={impactData.survivableStreak}
              maxAcceptableLoss={inputs.maxAcceptableLoss}
            />
          </div>

          {/* Right Column: Table (3 cols) - Fixed Height for scrolling */}
          <div className="lg:col-span-3 h-[400px] lg:h-[600px] w-full">
            <StreakTable 
              rows={tableData} 
              referenceWinRate={inputs.referenceWinRate} 
              onSelectWinRate={handleWinRateSelect}
            />
          </div>
        </div>

        {/* New Glossary Section - Will now be naturally pushed down */}
        <Glossary />

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 text-center border-t border-slate-800/30 w-full mt-4">
        <p className="text-xs text-slate-500 font-medium">
          &copy;2025 Waring Trading Academy. Todos los derechos reservados.
          <span className="block sm:inline sm:ml-1 mt-1 sm:mt-0">
             App creada con ❤️ por <a href="https://mercamocion.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors underline decoration-slate-700 hover:decoration-emerald-400">mercamocion.com</a>
          </span>
        </p>
      </footer>
    </div>
  );
};

export default App;
