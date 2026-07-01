import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount',
  standalone: true
})
export class DiscountPipe implements PipeTransform {
  /**
   * Applies a percentage discount to a price value.
   * Usage: {{ price | discount:20 }}  → returns price with 20% discount
   * @param value - The original price
   * @param discountPercent - The discount percentage (default: 10)
   * @returns The discounted price
   */
  transform(value: number, discountPercent: number = 10): number {
    if (!value || value <= 0) return 0;
    if (discountPercent < 0 || discountPercent > 100) return value;
    return value - (value * discountPercent / 100);
  }
}
