
import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Hash, DollarSign, Percent, TrendingDown, ShieldAlert, Activity } from 'lucide-react';

export const Glossary: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const terms = [
    {
      acronym: 'T',
      title: 'Muestra Total',
      definition: 'El número total de operaciones que planeas realizar (ej. 500 trades). Define el tamaño del escenario estadístico.',
      icon: <Hash className="w-4 h-4 text-slate-400" />
    },
    {
      acronym: 'C',
      title: 'Capital Inicial',
      definition: 'El dinero con el que empiezas. Base para calcular el tamaño de posición y las pérdidas.',
      icon: <DollarSign className="w-4 h-4 text-green-400" />
    },
    {
      acronym: 'R%',
      title: 'Riesgo por Operación',
      definition: 'Porcentaje fijo de tu cuenta que arriesgas en cada trade (ej. 1% o 2%).',
      icon: <Percent className="w-4 h-4 text-blue-400" />
    },
    {
      acronym: 'N',
      title: 'Racha Máxima Esperada',
      definition: 'Número estadístico de pérdidas consecutivas que es "normal" esperar dada tu efectividad (Win Rate) y la muestra (T).',
      icon: <TrendingDown className="w-4 h-4 text-orange-400" />
    },
    {
      acronym: 'IDR',
      title: 'Impacto de la Racha',
      definition: 'Dinero real que perderías si sufres la racha esperada (N). Se calcula aplicando el interés compuesto negativo.',
      icon: <Activity className="w-4 h-4 text-indigo-400" />
    },
    {
      acronym: 'RSL',
      title: 'Racha Soportable Límite',
      definition: 'Cuántas pérdidas consecutivas puedes aguantar antes de tocar tu límite de pérdida máxima (PMA%) y "quebrar" tu gestión.',
      icon: <ShieldAlert className="w-4 h-4 text-red-400" />
    },
    {
      acronym: 'PMA%',
      title: 'Pérdida Máxima Aceptable',
      definition: 'El "Drawdown" máximo que toleras (ej. 50%). Si tu cuenta cae este porcentaje, se considera quiebra o parada obligatoria.',
      icon: <Percent className="w-4 h-4 text-red-400" />
    }
  ];

  return (
    <div className="mt-8 border-t border-slate-800 pt-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800 transition-colors group border border-slate-700/50"
      >
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400 group-hover:text-indigo-300 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-slate-200 font-semibold text-sm">Glosario de Términos y Siglas</h3>
            <p className="text-slate-500 text-xs">Haz clic para entender qué significan N, IDR, RSL y más</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {terms.map((term, index) => (
            <div key={index} className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                {term.icon}
                <span className="text-white font-bold font-mono bg-slate-800 px-1.5 py-0.5 rounded text-xs">{term.acronym}</span>
                <span className="text-slate-300 font-medium text-sm">{term.title}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {term.definition}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
