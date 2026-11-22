import { TestBed } from '@angular/core/testing';
import { GasCalculator } from './gas-calculator';

describe('GasCalculator', () => {
  async function render(m3: string): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(GasCalculator);
    const page = fixture.nativeElement as HTMLElement;
    const input = page.querySelector<HTMLInputElement>('#m3')!;
    input.value = m3;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    return page;
  }

  it('shows the bill for a typed reading', async () => {
    const page = await render('40');
    // 40 x 8 = 320 EGP, formatted in Arabic-Indic digits.
    expect(page.querySelector('.total')?.textContent).toContain('٣٢٠٫٠٠');
  });

  it('warns when a price jump is close', async () => {
    const page = await render('28');
    expect(page.querySelector('.warning')).not.toBeNull();
  });

  it('flags input that is not a whole number', async () => {
    const page = await render('abc');
    expect(page.querySelector('#m3')?.getAttribute('aria-invalid')).toBe('true');
    expect(page.querySelector('.total')).toBeNull();
  });
});
