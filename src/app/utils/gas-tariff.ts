// Egyptian household natural gas tariff.
//
// When prices change, this is the only file that needs editing.
// Money is in piasters (100 piasters = 1 EGP) to keep the maths in whole numbers.

export const GAS_TARIFF_EFFECTIVE_FROM = '10 مارس 2026';

export const GAS_TARIFF_SOURCES = [
  {
    label: 'الأسعار: مبتدا، 10 مارس 2026، نقلاً عن وزارة البترول',
    url: 'https://www.mobtada.com/economy/1594969/',
  },
  {
    label: 'طريقة الحساب: مصراوي، فبراير 2026',
    url: 'https://www.masrawy.com/news/news_economy/details/2026/2/27/2949592/',
  },
];

/**
 * Unlike electricity, gas tiers are NOT stacked. The whole month's consumption
 * is charged at the price of the tier it falls into. So 31 m³ costs more than
 * 30 m³ by a lot more than one cubic metre's price.
 *
 * Not yet confirmed against a real bill: this follows the published examples.
 * `upToM3: null` means "no upper limit".
 */
export const GAS_TIERS: { upToM3: number | null; pricePiasters: number }[] = [
  { upToM3: 30, pricePiasters: 600 },
  { upToM3: 60, pricePiasters: 800 },
  { upToM3: null, pricePiasters: 1200 },
];
