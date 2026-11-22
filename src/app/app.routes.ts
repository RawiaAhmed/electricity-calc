import { Routes } from '@angular/router';
import { BillCalculator } from './components/bill-calculator/bill-calculator';
import { GasCalculator } from './components/gas-calculator/gas-calculator';

// Every route is prerendered to its own static HTML file (see app.routes.server.ts).
// Add each new page to public/sitemap.xml too.
export const routes: Routes = [
  { path: '', component: BillCalculator },
  { path: 'gas', component: GasCalculator },
];
