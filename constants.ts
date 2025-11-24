export const DEFAULT_INPUTS = {
  totalTrades: 500,
  initialCapital: 1000,
  riskPerTrade: 2.0,
  maxAcceptableLoss: 50.0,
  referenceWinRate: 60,
};

// Generates 30, 35, ..., 95, 99
export const WIN_RATES = [
  ...Array.from({ length: 14 }, (_, i) => 30 + i * 5),
  99
];
