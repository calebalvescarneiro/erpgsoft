export type RewardType = 'POINTS' | 'CASHBACK' | 'GIFT_CARD';

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  rewardType: RewardType;
  accrualRule: {
    multiplier: number;
    minimumPurchase: number;
  };
  redemptionRule: {
    unitValue: number;
    minimumBalance: number;
  };
}

export const DEFAULT_PROGRAMS: LoyaltyProgram[] = [
  {
    id: 'default-points',
    name: 'Fidelidade Padrão',
    description: '1 ponto a cada R$1 em compras, resgatável a partir de 500 pontos.',
    rewardType: 'POINTS',
    accrualRule: {
      multiplier: 1,
      minimumPurchase: 10
    },
    redemptionRule: {
      unitValue: 0.01,
      minimumBalance: 500
    }
  },
  {
    id: 'cashback-boost',
    name: 'Cashback 3%',
    description: 'Cashback automático de 3% para compras acima de R$50.',
    rewardType: 'CASHBACK',
    accrualRule: {
      multiplier: 0.03,
      minimumPurchase: 50
    },
    redemptionRule: {
      unitValue: 1,
      minimumBalance: 10
    }
  },
  {
    id: 'gift-card-delivery',
    name: 'Gift Card Delivery',
    description: 'Gere gift cards de R$25 a cada R$400 consumidos.',
    rewardType: 'GIFT_CARD',
    accrualRule: {
      multiplier: 25 / 400,
      minimumPurchase: 80
    },
    redemptionRule: {
      unitValue: 25,
      minimumBalance: 1
    }
  }
];

export function resolveProgram(programId: string) {
  const program = DEFAULT_PROGRAMS.find((candidate) => candidate.id === programId);
  if (!program) {
    throw new Error(`Program ${programId} not configured`);
  }
  return program;
}
