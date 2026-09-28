# حاسبة فاتورة الكهرباء (Egypt electricity bill calculator)

Arabic, right-to-left calculator for Egyptian household electricity bills. Angular 22, prerendered to static HTML so search engines see the full content.

## Commands

The Angular CLI needs Node 22.22+ or 24.15+. The machine default is Node 20, so prefix commands:

```bash
export PATH=~/.nvm/versions/node/v24.19.0/bin:$PATH
npm start          # dev server on http://localhost:4200
npm test           # 22 tests
npm run build      # static site in dist/egypt-electricity-calculator/browser
```

## Deploy (Cloudflare Pages)

```bash
npx wrangler login   # once, opens the browser
npm run deploy       # tests, builds, then uploads to egypt-electricity-calculator.pages.dev
```

`npm run deploy` stops before uploading if any test fails, so a broken price table never goes live.

## When prices change

Edit only `src/app/utils/tariff.ts`: the tier prices, fees, `TARIFF_EFFECTIVE_FROM` and the sources. Then update the expected totals in `src/app/service/bill.service.spec.ts` by hand and run the tests. Do not copy totals from news articles: at least one detailed guide (aqaar24, August 2026) stacked all 7 tiers and printed wrong bills.

## How a bill is calculated

Verified against the regulator (egyptera.org) and cross-checked with the ministry's published subsidy percentages:

- Up to 100 kWh: 0-50 at tier 1, 51-100 at tier 2.
- 101 to 650 kWh: restarts at tier 3 (0-200), then tier 4 (201-350), tier 5 (351-650).
- 651 to 1000 kWh: every kWh at tier 6.
- Above 1000 kWh: every kWh at tier 7.
- Plus a monthly service fee by consumption band (1 to 40 EGP), or 9 EGP for a zero reading.

Not covered: coded meters (العداد الكودي), which have their own flat pricing.

## Not done yet

- AdSense: apply once the site is live with its own domain. Ad slots are not in the page yet.
- Domain and hosting.
