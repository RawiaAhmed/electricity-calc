import { Injectable } from '@angular/core';
import {
  CONSUMPTION_GROUPS,
  ConsumptionGroup,
  SERVICE_FEES,
  ZERO_READING_FEE_PIASTERS,
} from '../utils/tariff';

export interface BillLine {
  fromKwh: number;
  toKwh: number;
  kwh: number;
  pricePiasters: number;
  costPiasters: number;
}

export interface Bill {
  kwh: number;
  lines: BillLine[];
  energyPiasters: number;
  serviceFeePiasters: number;
  totalPiasters: number;
}

/** A warning that a few more kWh would move the bill into a pricier group. */
export interface PriceJump {
  kwhUntilJump: number;
  jumpAtKwh: number;
  billAtJump: Bill;
}

// Only warn when the jump is close enough to matter this month.
const JUMP_WARNING_WINDOW_KWH = 50;

@Injectable({ providedIn: 'root' })
export class BillService {
  calculateBill(kwh: number): Bill {
    if (kwh === 0) {
      return { kwh, lines: [], energyPiasters: 0, serviceFeePiasters: ZERO_READING_FEE_PIASTERS, totalPiasters: ZERO_READING_FEE_PIASTERS };
    }

    const lines = this.priceLines(kwh, this.findGroup(kwh));
    const energyPiasters = lines.reduce((sum, line) => sum + line.costPiasters, 0);
    const serviceFeePiasters = this.findServiceFee(kwh);

    return {
      kwh,
      lines,
      energyPiasters,
      serviceFeePiasters,
      totalPiasters: energyPiasters + serviceFeePiasters,
    };
  }

  findNextPriceJump(kwh: number): PriceJump | null {
    const group = this.findGroup(kwh);
    if (group.maxKwh === null) return null;

    const kwhUntilJump = group.maxKwh + 1 - kwh;
    if (kwhUntilJump > JUMP_WARNING_WINDOW_KWH) return null;

    const jumpAtKwh = group.maxKwh + 1;
    return { kwhUntilJump, jumpAtKwh, billAtJump: this.calculateBill(jumpAtKwh) };
  }

  private findGroup(kwh: number): ConsumptionGroup {
    const group = CONSUMPTION_GROUPS.find((candidate) => candidate.maxKwh === null || kwh <= candidate.maxKwh);
    // The last group has no upper limit, so a match always exists.
    return group!;
  }

  private priceLines(kwh: number, group: ConsumptionGroup): BillLine[] {
    const lines: BillLine[] = [];
    let bandStart = 0;

    for (const band of group.bands) {
      const bandEnd = band.upToKwh === null ? kwh : Math.min(kwh, band.upToKwh);
      const kwhInBand = bandEnd - bandStart;
      if (kwhInBand <= 0) break;

      lines.push({
        fromKwh: bandStart + 1,
        toKwh: bandEnd,
        kwh: kwhInBand,
        pricePiasters: band.pricePiasters,
        costPiasters: kwhInBand * band.pricePiasters,
      });
      bandStart = bandEnd;
    }

    return lines;
  }

  private findServiceFee(kwh: number): number {
    const fee = SERVICE_FEES.find((candidate) => candidate.upToKwh === null || kwh <= candidate.upToKwh);
    return fee!.feePiasters;
  }
}
