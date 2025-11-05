export type TaxRegimeCode =
  | 'CPF'
  | 'MEI'
  | 'SIMPLES_NACIONAL'
  | 'SIMPLES_HIBRIDO'
  | 'LUCRO_PRESUMIDO'
  | 'LUCRO_REAL';

export type BusinessSegment =
  | 'ALIMENTACAO'
  | 'SUPERMERCADO'
  | 'COMERCIO'
  | 'DISTRIBUIDORA'
  | 'SERVICOS';

export type FiscalDocumentType = 'NFCE' | 'NFE' | 'NFSE';

export interface TaxRule {
  regime: TaxRegimeCode;
  segment: BusinessSegment | '*';
  document: FiscalDocumentType;
  description: string;
  rates: {
    icms?: number;
    iss?: number;
    pis?: number;
    cofins?: number;
  };
  contingencyAllowed: boolean;
}

export const REGIME_RULES: TaxRule[] = [
  {
    regime: 'MEI',
    segment: '*',
    document: 'NFCE',
    description: 'Fluxo simplificado para microempreendedor individual com alíquota reduzida.',
    rates: { icms: 0.01 },
    contingencyAllowed: true
  },
  {
    regime: 'SIMPLES_NACIONAL',
    segment: 'ALIMENTACAO',
    document: 'NFCE',
    description: 'Simples Nacional para alimentação com ICMS reduzido e PIS/COFINS unificados.',
    rates: { icms: 0.035, pis: 0.0065, cofins: 0.03 },
    contingencyAllowed: true
  },
  {
    regime: 'SIMPLES_NACIONAL',
    segment: 'COMERCIO',
    document: 'NFE',
    description: 'Simples Nacional comércio varejista.',
    rates: { icms: 0.04, pis: 0.0065, cofins: 0.03 },
    contingencyAllowed: true
  },
  {
    regime: 'SIMPLES_HIBRIDO',
    segment: '*',
    document: 'NFE',
    description: 'Estrutura híbrida do Simples Nacional com partilha de impostos municipais.',
    rates: { icms: 0.05, pis: 0.01, cofins: 0.036 },
    contingencyAllowed: true
  },
  {
    regime: 'LUCRO_PRESUMIDO',
    segment: 'SUPERMERCADO',
    document: 'NFE',
    description: 'Lucro Presumido para supermercados com carga tributária completa.',
    rates: { icms: 0.12, pis: 0.018, cofins: 0.083 },
    contingencyAllowed: true
  },
  {
    regime: 'LUCRO_REAL',
    segment: '*',
    document: 'NFE',
    description: 'Lucro Real com incidência integral de tributos federais e estaduais.',
    rates: { icms: 0.18, pis: 0.0165, cofins: 0.076 },
    contingencyAllowed: true
  },
  {
    regime: 'CPF',
    segment: 'SERVICOS',
    document: 'NFSE',
    description: 'Prestador de serviço pessoa física com retenção de ISS simplificada.',
    rates: { iss: 0.02 },
    contingencyAllowed: false
  }
];

export function resolveRule(
  regime: TaxRegimeCode,
  segment: BusinessSegment,
  document: FiscalDocumentType
): TaxRule {
  const specificRule = REGIME_RULES.find(
    (rule) =>
      rule.regime === regime &&
      (rule.segment === segment || rule.segment === '*') &&
      rule.document === document
  );
  if (!specificRule) {
    const fallback = REGIME_RULES.find(
      (rule) => rule.regime === regime && rule.segment === '*' && rule.document === document
    );
    if (fallback) {
      return fallback;
    }
    throw new Error(`No fiscal rule configured for regime ${regime} with document ${document}`);
  }
  return specificRule;
}
