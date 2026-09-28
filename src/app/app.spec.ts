import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the bill calculator', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('app-bill-calculator #kwh')).not.toBeNull();
  });
});
