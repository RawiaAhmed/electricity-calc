// Formatting and parsing shared by every calculator page.

// Readings above this are almost certainly a typo, and would print absurd bills.
const MAX_READING = 100_000;

const moneyFormat = new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numberFormat = new Intl.NumberFormat('ar-EG');

export function formatMoney(piasters: number): string {
  return moneyFormat.format(piasters / 100);
}

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

/** Accepts a whole-number meter reading, typed in Western or Arabic-Indic digits. */
export function parseReading(text: string): number | null {
  const westernDigits = text.trim().replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
  if (!/^\d+$/.test(westernDigits)) return null;

  const reading = Number(westernDigits);
  return reading <= MAX_READING ? reading : null;
}
