import { GasBillService } from './gas-bill.service';

const gasBillService = new GasBillService();

// Expected totals worked out by hand from the March 2026 prices (6 / 8 / 12 EGP),
// charging the whole consumption at the price of its tier.
describe('GasBillService.calculateBill', () => {
  const expectedTotals: [m3: number, totalPiasters: number][] = [
    [0, 0],
    [25, 25 * 600],
    [30, 30 * 600],
    [31, 31 * 800], // the whole bill moves to tier 2
    [60, 60 * 800],
    [61, 61 * 1200], // the whole bill moves to tier 3
    [100, 100 * 1200],
  ];

  for (const [m3, totalPiasters] of expectedTotals) {
    it(`charges ${totalPiasters / 100} EGP for ${m3} m³`, () => {
      expect(gasBillService.calculateBill(m3).totalPiasters).toBe(totalPiasters);
    });
  }

  it('reports the official tier number', () => {
    expect(gasBillService.calculateBill(30).tierNumber).toBe(1);
    expect(gasBillService.calculateBill(31).tierNumber).toBe(2);
    expect(gasBillService.calculateBill(61).tierNumber).toBe(3);
  });
});

describe('GasBillService.findNextPriceJump', () => {
  it('warns when the next tier is close', () => {
    const jump = gasBillService.findNextPriceJump(28);
    expect(jump?.m3UntilJump).toBe(3);
    expect(jump?.jumpAtM3).toBe(31);
    expect(jump?.billAtJump.totalPiasters).toBe(24800);
  });

  it('stays quiet when the next tier is far away', () => {
    expect(gasBillService.findNextPriceJump(10)).toBeNull();
  });

  it('has nothing to warn about in the top tier', () => {
    expect(gasBillService.findNextPriceJump(80)).toBeNull();
  });
});
