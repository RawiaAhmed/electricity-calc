import { Component, computed, inject, signal } from '@angular/core';
import { GasBillService } from '../../service/gas-bill.service';
import { SeoService } from '../../service/seo.service';
import { formatMoney, formatNumber, parseReading } from '../../utils/format';
import { GAS_TARIFF_EFFECTIVE_FROM, GAS_TARIFF_SOURCES, GAS_TIERS } from '../../utils/gas-tariff';

@Component({
  selector: 'app-gas-calculator',
  templateUrl: './gas-calculator.html',
  styleUrl: '../calculator-page.scss',
})
export class GasCalculator {
  private readonly gasBillService = inject(GasBillService);

  protected readonly effectiveFrom = GAS_TARIFF_EFFECTIVE_FROM;
  protected readonly sources = GAS_TARIFF_SOURCES;

  protected readonly tierTable = [
    { from: 0, to: 30, price: GAS_TIERS[0].pricePiasters },
    { from: 31, to: 60, price: GAS_TIERS[1].pricePiasters },
    { from: 60, to: null, price: GAS_TIERS[2].pricePiasters },
  ];

  // Worked example for the FAQ, calculated rather than typed so it follows price changes.
  protected readonly billAt30 = this.gasBillService.calculateBill(30).totalPiasters;
  protected readonly billAt31 = this.gasBillService.calculateBill(31).totalPiasters;

  protected readonly m3Input = signal('');

  protected readonly m3 = computed(() => parseReading(this.m3Input()));
  protected readonly inputError = computed(() => this.m3Input().trim() !== '' && this.m3() === null);
  protected readonly bill = computed(() => {
    const m3 = this.m3();
    return m3 === null ? null : this.gasBillService.calculateBill(m3);
  });
  protected readonly priceJump = computed(() => {
    const m3 = this.m3();
    return m3 === null ? null : this.gasBillService.findNextPriceJump(m3);
  });

  protected readonly money = formatMoney;
  protected readonly number = formatNumber;

  constructor() {
    inject(SeoService).setPage({
      title: 'حاسبة فاتورة الغاز الطبيعي 2026 | احسب فاتورتك بأسعار الشرائح الجديدة',
      description:
        'احسب فاتورة الغاز الطبيعي للمنازل في مصر بأسعار مارس 2026 (6 و8 و12 جنيه للمتر)، مع تنبيه لو استهلاكك قريب من شريحة أغلى.',
      path: '/gas',
      image: '/og-gas.png',
      imageAlt: 'حاسبة فاتورة الغاز الطبيعي: احسب فاتورتك بأسعار مارس 2026',
    });
  }

  protected onM3Input(event: Event): void {
    this.m3Input.set((event.target as HTMLInputElement).value);
  }
}
