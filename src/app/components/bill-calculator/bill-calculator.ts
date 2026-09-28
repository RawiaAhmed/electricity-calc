import { Component, computed, inject, signal } from '@angular/core';
import { BillService } from '../../service/bill.service';
import { TARIFF_EFFECTIVE_FROM, TARIFF_SOURCES, TIER_PRICES } from '../../utils/tariff';

// Readings above this are almost certainly a typo, and would print absurd bills.
const MAX_KWH = 100_000;

const moneyFormat = new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numberFormat = new Intl.NumberFormat('ar-EG');

@Component({
  selector: 'app-bill-calculator',
  templateUrl: './bill-calculator.html',
  styleUrl: './bill-calculator.scss',
})
export class BillCalculator {
  private readonly billService = inject(BillService);

  protected readonly effectiveFrom = TARIFF_EFFECTIVE_FROM;
  protected readonly sources = TARIFF_SOURCES;

  // `to: null` is the open-ended top tier.
  protected readonly tierTable = [
    { from: 0, to: 50, price: TIER_PRICES.tier1 },
    { from: 51, to: 100, price: TIER_PRICES.tier2 },
    { from: 101, to: 200, price: TIER_PRICES.tier3 },
    { from: 201, to: 350, price: TIER_PRICES.tier4 },
    { from: 351, to: 650, price: TIER_PRICES.tier5 },
    { from: 651, to: 1000, price: TIER_PRICES.tier6 },
    { from: 1000, to: null, price: TIER_PRICES.tier7 },
  ];

  // Worked example for the FAQ, calculated rather than typed so it follows price changes.
  protected readonly billAt100 = this.billService.calculateBill(100).totalPiasters;
  protected readonly billAt101 = this.billService.calculateBill(101).totalPiasters;

  protected readonly kwhInput = signal('');

  protected readonly kwh = computed(() => parseKwh(this.kwhInput()));
  protected readonly inputError = computed(() => this.kwhInput().trim() !== '' && this.kwh() === null);
  protected readonly bill = computed(() => {
    const kwh = this.kwh();
    return kwh === null ? null : this.billService.calculateBill(kwh);
  });
  protected readonly priceJump = computed(() => {
    const kwh = this.kwh();
    return kwh === null ? null : this.billService.findNextPriceJump(kwh);
  });

  protected onKwhInput(event: Event): void {
    this.kwhInput.set((event.target as HTMLInputElement).value);
  }

  protected money(piasters: number): string {
    return moneyFormat.format(piasters / 100);
  }

  protected number(value: number): string {
    return numberFormat.format(value);
  }
}

/** Accepts whole kWh, typed in Western or Arabic-Indic digits. */
function parseKwh(text: string): number | null {
  const westernDigits = text.trim().replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
  if (!/^\d+$/.test(westernDigits)) return null;

  const kwh = Number(westernDigits);
  return kwh <= MAX_KWH ? kwh : null;
}
