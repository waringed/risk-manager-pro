export interface RiskInputs {
  totalTrades: number; // T
  initialCapital: number; // C
  riskPerTrade: number; // R%
  maxAcceptableLoss: number; // PMA%
  referenceWinRate: number; // Win Rate for calculations and highlighting
}

export interface StreakRow {
  winRate: number; // P_win
  expectedStreak: number; // N
}

export interface FinancialImpact {
  streakDuration: number; // N at reference
  monetaryImpact: number; // IDR
  survivableStreak: number; // RSL
  endingCapital: number;
}