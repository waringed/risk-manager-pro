import { StreakRow, FinancialImpact } from '../types';

/**
 * Calculates the probability factor C3 based on sample size.
 * Note: In standard probability for streaks, this usually relates to 1/T or 1 - 1/T.
 */
export const calculateSampleFactor = (totalTrades: number): number => {
  if (totalTrades <= 0) return 0;
  return 1 - (1 / totalTrades);
};

/**
 * Calculates the Expected Max Losing Streak (N).
 * 
 * Formula from prompt interpretation:
 * N = round( ln(1 - C3) / ln(1 - P_win) * -1 )
 * 
 * Note: The prompt defined C3 = 1 - 1/T.
 * Therefore (1 - C3) = 1/T.
 * ln(1 - C3) = ln(1/T) = -ln(T).
 * The prompt formula likely had a typo asking for ln(C3) directly which results in ~0.
 * We use the corrected mathematical approach for "Expected Streak in T trials":
 * N = | ln(T) / ln(1 - WinRate) |
 */
export const calculateExpectedStreak = (totalTrades: number, winRatePercent: number): number => {
  if (totalTrades <= 0) return 0;
  if (winRatePercent >= 100) return 0;
  if (winRatePercent <= 0) return totalTrades; // Infinite loss if 0% win rate

  const winRate = winRatePercent / 100;
  const lossRate = 1 - winRate;
  
  // Using the standard formula for max consecutive losses in a sample size T
  // N = ln(T) / -ln(LossRate)
  const numerator = Math.log(totalTrades);
  const denominator = -Math.log(lossRate);
  
  const result = numerator / denominator;
  return Math.round(result);
};

export const calculateStreakTable = (totalTrades: number, winRates: number[]): StreakRow[] => {
  return winRates.map((rate) => ({
    winRate: rate,
    expectedStreak: calculateExpectedStreak(totalTrades, rate),
  }));
};

/**
 * Calculates Financial Impact
 */
export const calculateFinancialImpact = (
  initialCapital: number,
  riskPerTradePercent: number,
  maxAcceptableLossPercent: number,
  expectedStreakAtReference: number
): FinancialImpact => {
  const riskPerTrade = riskPerTradePercent / 100;
  const maxAcceptableLoss = maxAcceptableLossPercent / 100;

  // 1. Monetary Impact of Streak (IDR)
  // Geometric decay: Capital_final = Capital_initial * (1 - R)^N
  const remainingCapitalAfterStreak = initialCapital * Math.pow(1 - riskPerTrade, expectedStreakAtReference);
  const monetaryImpact = initialCapital - remainingCapitalAfterStreak;

  // 2. Survivable Streak (RSL)
  // (1 - R)^RSL = (1 - PMA)
  // RSL * ln(1 - R) = ln(1 - PMA)
  // RSL = ln(1 - PMA) / ln(1 - R)
  
  let survivableStreak = 0;
  if (riskPerTrade > 0) {
     const numerator = Math.log(1 - maxAcceptableLoss);
     const denominator = Math.log(1 - riskPerTrade);
     survivableStreak = Math.floor(numerator / denominator);
  }

  return {
    streakDuration: expectedStreakAtReference,
    monetaryImpact,
    survivableStreak,
    endingCapital: remainingCapitalAfterStreak
  };
};