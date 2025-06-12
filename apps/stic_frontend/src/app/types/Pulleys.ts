export type PulleyQuotationRequest = {
  material: string;
  outerDiameter: number;
  innerBoreDiameter: number;
  width: number;
  grooveCount: number;
  grooveType: string;
};

export type PulleyQuotationResponse = {
  price: number;
  outerDiameter: number;
  innerBoreDiameter: number;
  width: number;
  grooveCount: number;
  grooveType: string;
};
