import { Component } from '@angular/core';
import { BillCalculator } from './components/bill-calculator/bill-calculator';

@Component({
  selector: 'app-root',
  imports: [BillCalculator],
  template: '<app-bill-calculator />',
})
export class App {}
