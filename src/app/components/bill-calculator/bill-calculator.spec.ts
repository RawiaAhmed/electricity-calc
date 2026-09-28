import { TestBed } from '@angular/core/testing';
import { BillCalculator } from './bill-calculator';

describe('BillCalculator', () => {
  async function render(kwh: string): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(BillCalculator);
    const page = fixture.nativeElement as HTMLElement;
    const input = page.querySelector<HTMLInputElement>('#kwh')!;
    input.value = kwh;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    return page;
  }

  it('shows the bill for a typed reading', async () => {
    const page = await render('300');
    // 397 EGP, formatted in Arabic-Indic digits.
    expect(page.querySelector('.total')?.textContent).toContain('٣٩٧٫٠٠');
  });

  it('accepts Arabic-Indic digits', async () => {
    const page = await render('٣٠٠');
    expect(page.querySelector('.total')?.textContent).toContain('٣٩٧٫٠٠');
  });

  it('warns when a price jump is close', async () => {
    const page = await render('95');
    expect(page.querySelector('.warning')).not.toBeNull();
  });

  it('flags input that is not a whole number', async () => {
    const page = await render('12.5');
    expect(page.querySelector('#kwh')?.getAttribute('aria-invalid')).toBe('true');
    expect(page.querySelector('.total')).toBeNull();
  });
});
