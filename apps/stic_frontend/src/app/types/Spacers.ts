export type QuotationRequest = {
  make: string;
  model: string;
  year: number;
  inches: number;
  material: string;
};

export type QuotationResponse = {
  id: number;
  createdAt: string;
  boltCount: number;
  boltPattern: number;
  thicknessMm: number;
  centerBore: number;
  isHubCentric: boolean;
  price: number;
};