import type { PackagingSpec } from './types';

/** Usable cargo volume (m³) — industry averages */
export const CONTAINER_20FT_CBM = 28;
export const CONTAINER_40HC_CBM = 68;

export function cartonCbm(packaging: PackagingSpec): number {
  const l = packaging.lengthCm / 100;
  const w = packaging.widthCm / 100;
  const h = packaging.heightCm / 100;
  return l * w * h;
}

export interface ShippingCalculation {
  quantity: number;
  cartons: number;
  totalCbm: number;
  totalWeightKg: number;
  cbmPerCarton: number;
  /** Max cartons that fit in each container type (single SKU) */
  maxCartons20ft: number;
  maxCartons40hc: number;
  maxPieces20ft: number;
  maxPieces40hc: number;
  /** How much of a container this order uses */
  containerFill20ft: number;
  containerFill40hc: number;
}

export function calculateShipping(
  quantity: number,
  packaging: PackagingSpec
): ShippingCalculation {
  const qty = Math.max(1, Math.floor(quantity) || 1);
  const cbmPerCarton = cartonCbm(packaging);
  const cartons = Math.ceil(qty / packaging.piecesPerCarton);
  const totalCbm = cartons * cbmPerCarton;
  const totalWeightKg = cartons * packaging.weightKg;

  const maxCartons20ft =
    cbmPerCarton > 0 ? Math.floor(CONTAINER_20FT_CBM / cbmPerCarton) : 0;
  const maxCartons40hc =
    cbmPerCarton > 0 ? Math.floor(CONTAINER_40HC_CBM / cbmPerCarton) : 0;

  return {
    quantity: qty,
    cartons,
    totalCbm: Math.round(totalCbm * 1000) / 1000,
    totalWeightKg: Math.round(totalWeightKg * 10) / 10,
    cbmPerCarton: Math.round(cbmPerCarton * 1000) / 1000,
    maxCartons20ft,
    maxCartons40hc,
    maxPieces20ft: maxCartons20ft * packaging.piecesPerCarton,
    maxPieces40hc: maxCartons40hc * packaging.piecesPerCarton,
    containerFill20ft:
      CONTAINER_20FT_CBM > 0
        ? Math.round((totalCbm / CONTAINER_20FT_CBM) * 100)
        : 0,
    containerFill40hc:
      CONTAINER_40HC_CBM > 0
        ? Math.round((totalCbm / CONTAINER_40HC_CBM) * 100)
        : 0
  };
}

/** Default packaging by category for B2B synthetic thatch panels */
export const PACKAGING_BY_CATEGORY: Record<string, PackagingSpec> = {
  'cat-palm': {
    lengthCm: 52,
    widthCm: 42,
    heightCm: 38,
    weightKg: 12,
    piecesPerCarton: 10
  },
  'cat-nipa': {
    lengthCm: 50,
    widthCm: 40,
    heightCm: 36,
    weightKg: 11,
    piecesPerCarton: 10
  },
  'cat-cadjan': {
    lengthCm: 55,
    widthCm: 44,
    heightCm: 40,
    weightKg: 13,
    piecesPerCarton: 8
  },
  'cat-straw': {
    lengthCm: 48,
    widthCm: 38,
    heightCm: 34,
    weightKg: 10,
    piecesPerCarton: 12
  },
  'cat-reed': {
    lengthCm: 50,
    widthCm: 40,
    heightCm: 35,
    weightKg: 10,
    piecesPerCarton: 12
  },
  'cat-makuti': {
    lengthCm: 52,
    widthCm: 42,
    heightCm: 38,
    weightKg: 12,
    piecesPerCarton: 10
  }
};

export const DEFAULT_PACKAGING: PackagingSpec = {
  lengthCm: 120,
  widthCm: 80,
  heightCm: 60,
  weightKg: 35,
  piecesPerCarton: 6
};
