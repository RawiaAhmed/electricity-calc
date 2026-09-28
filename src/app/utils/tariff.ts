// Egyptian household electricity tariff.
//
// When the government changes prices, this is the only file that needs editing.
// All money is stored in piasters (100 piasters = 1 EGP) so the maths stays in
// whole numbers and never hits floating-point rounding errors.

export const TARIFF_EFFECTIVE_FROM = 'استهلاك أغسطس 2026';

export const TARIFF_SOURCES = [
  {
    label: 'الأسعار: مصراوي، 1 أغسطس 2026، نقلاً عن وزارة الكهرباء',
    url: 'https://www.masrawy.com/news/news_egypt/details/2026/8/1/3026220/',
  },
  {
    label: 'طريقة المحاسبة ومقابل خدمة العملاء: جهاز تنظيم مرفق الكهرباء وحماية المستهلك',
    url: 'https://egyptera.org/ar/TarrifAug2024.aspx',
  },
];

/** Price per kWh, in piasters, for each of the 7 official tiers. */
export const TIER_PRICES = {
  tier1: 68, // 0 - 50
  tier2: 87, // 51 - 100
  tier3: 106, // 101 - 200
  tier4: 174, // 201 - 350
  tier5: 218, // 351 - 650
  tier6: 235, // 651 - 1000
  tier7: 289, // above 1000
};

/**
 * A band of consumption charged at one price.
 * `upToKwh: null` means "no upper limit".
 */
export interface PriceBand {
  upToKwh: number | null;
  pricePiasters: number;
}

/**
 * The regulator does not simply stack the 7 tiers. It first puts the whole
 * month's consumption into one of 4 groups, and each group has its own bands.
 * Moving into a higher group means losing the cheaper bands entirely, which is
 * why a bill can jump sharply at 101 and 651 kWh.
 */
export interface ConsumptionGroup {
  maxKwh: number | null;
  bands: PriceBand[];
}

export const CONSUMPTION_GROUPS: ConsumptionGroup[] = [
  {
    // Up to 100 kWh: the two cheapest tiers, stacked.
    maxKwh: 100,
    bands: [
      { upToKwh: 50, pricePiasters: TIER_PRICES.tier1 },
      { upToKwh: 100, pricePiasters: TIER_PRICES.tier2 },
    ],
  },
  {
    // 101 to 650 kWh: starts again from zero at tier 3. Tiers 1 and 2 are lost.
    maxKwh: 650,
    bands: [
      { upToKwh: 200, pricePiasters: TIER_PRICES.tier3 },
      { upToKwh: 350, pricePiasters: TIER_PRICES.tier4 },
      { upToKwh: 650, pricePiasters: TIER_PRICES.tier5 },
    ],
  },
  {
    // 651 to 1000 kWh: every kWh at the tier 6 price.
    maxKwh: 1000,
    bands: [{ upToKwh: null, pricePiasters: TIER_PRICES.tier6 }],
  },
  {
    // Above 1000 kWh: every kWh at the tier 7 price.
    maxKwh: null,
    bands: [{ upToKwh: null, pricePiasters: TIER_PRICES.tier7 }],
  },
];

/** Monthly customer service fee, in piasters, chosen by total consumption. */
export const SERVICE_FEES: { upToKwh: number | null; feePiasters: number }[] = [
  { upToKwh: 50, feePiasters: 100 },
  { upToKwh: 100, feePiasters: 200 },
  { upToKwh: 200, feePiasters: 600 },
  { upToKwh: 350, feePiasters: 1100 },
  { upToKwh: 650, feePiasters: 1500 },
  { upToKwh: 1000, feePiasters: 2500 },
  { upToKwh: null, feePiasters: 4000 },
];

/** Fee when the meter reads zero for the month. */
export const ZERO_READING_FEE_PIASTERS = 900;
