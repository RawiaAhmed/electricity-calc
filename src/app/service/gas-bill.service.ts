import { Injectable } from '@angular/core';
import { GAS_TIERS } from '../utils/gas-tariff';

export interface GasBill {
  m3: number;
  /** 1, 2 or 3, matching the official tier numbers. */
  tierNumber: number;
  pricePiasters: number;
  totalPiasters: number;
}

/** A warning that a few more m³ would move the whole bill to a pricier tier. */
export interface GasPriceJump {
  m3UntilJump: number;
  jumpAtM3: number;
  billAtJump: GasBill;
}

// Gas tiers are only 30 m³ wide, so warn within a smaller window than electricity.
const JUMP_WARNING_WINDOW_M3 = 10;

@Injectable({ providedIn: 'root' })
export class GasBillService {
  calculateBill(m3: number): GasBill {
    const tierIndex = this.findTierIndex(m3);
    const pricePiasters = GAS_TIERS[tierIndex].pricePiasters;

    return {
      m3,
      tierNumber: tierIndex + 1,
      pricePiasters,
      totalPiasters: m3 * pricePiasters,
    };
  }

  findNextPriceJump(m3: number): GasPriceJump | null {
    const upToM3 = GAS_TIERS[this.findTierIndex(m3)].upToM3;
    if (upToM3 === null) return null;

    const m3UntilJump = upToM3 + 1 - m3;
    if (m3UntilJump > JUMP_WARNING_WINDOW_M3) return null;

    const jumpAtM3 = upToM3 + 1;
    return { m3UntilJump, jumpAtM3, billAtJump: this.calculateBill(jumpAtM3) };
  }

  private findTierIndex(m3: number): number {
    return GAS_TIERS.findIndex((tier) => tier.upToM3 === null || m3 <= tier.upToM3);
  }
}
