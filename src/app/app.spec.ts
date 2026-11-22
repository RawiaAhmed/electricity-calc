import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { App } from './app';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it('links to both calculators', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = [...(fixture.nativeElement as HTMLElement).querySelectorAll('nav ul a')];
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/', '/gas']);
  });

  it('shows the electricity calculator on the home page', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(harness.routeNativeElement?.querySelector('#kwh')).not.toBeNull();
  });

  it('shows the gas calculator on /gas', async () => {
    const harness = await RouterTestingHarness.create('/gas');
    expect(harness.routeNativeElement?.querySelector('#m3')).not.toBeNull();
  });
});
