import { BillService } from './bill.service';

const billService = new BillService();

// Expected totals are worked out by hand from the official structure and the
// August 2026 prices, in piasters. For example 300 kWh:
//   200 x 106 + 100 x 174 = 38,600, plus an 1,100 service fee = 39,700 (397 EGP).
// This matches the ministry's own statement that at 300 kWh the customer pays
// about 49% of the real cost, with a 419 EGP subsidy: 397 / (397 + 419) = 48.7%.

describe('calculateBill', () => {
  const expectedTotals: [kwh: number, totalPiasters: number][] = [
    [0, 900], // zero reading fee only
    [1, 68 + 100],
    [50, 3400 + 100],
    [51, 3400 + 87 + 200],
    [100, 7750 + 200],
    [101, 10706 + 600], // first price jump: tiers 1 and 2 are lost
    [200, 21200 + 600],
    [300, 38600 + 1100],
    [650, 112700 + 1500],
    [651, 152985 + 2500], // second price jump: everything at tier 6
    [1000, 235000 + 2500],
    [1001, 289289 + 4000], // everything at tier 7
  ];

  for (const [kwh, totalPiasters] of expectedTotals) {
    it(`charges ${totalPiasters / 100} EGP for ${kwh} kWh`, () => {
      expect(billService.calculateBill(kwh).totalPiasters).toBe(totalPiasters);
    });
  }

  it('restarts from tier 3 above 100 kWh instead of stacking on the cheap tiers', () => {
    const bill = billService.calculateBill(150);
    expect(bill.lines).toEqual([{ fromKwh: 1, toKwh: 150, kwh: 150, pricePiasters: 106, costPiasters: 15900 }]);
  });

  it('splits consumption across bands within a group', () => {
    const lines = billService.calculateBill(400).lines;
    expect(lines.map((line) => line.kwh)).toEqual([200, 150, 50]);
    expect(lines.map((line) => line.pricePiasters)).toEqual([106, 174, 218]);
  });

  it('charges every kWh at one price above 650', () => {
    const lines = billService.calculateBill(800).lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].pricePiasters).toBe(235);
  });
});

describe('findNextPriceJump', () => {
  it('warns when the next group is close', () => {
    const jump = billService.findNextPriceJump(95);
    expect(jump?.kwhUntilJump).toBe(6);
    expect(jump?.jumpAtKwh).toBe(101);
    expect(jump?.billAtJump.totalPiasters).toBe(11306);
  });

  it('stays quiet when the next group is far away', () => {
    expect(billService.findNextPriceJump(20)).toBeNull();
    expect(billService.findNextPriceJump(300)).toBeNull();
  });

  it('has nothing to warn about in the top group', () => {
    expect(billService.findNextPriceJump(1500)).toBeNull();
  });
});
