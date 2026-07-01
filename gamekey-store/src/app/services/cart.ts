import { Injectable, signal, computed, effect } from '@angular/core';
import { Game } from './game';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // 1. Initialize a writeable signal containing an empty array of Game objects
  private cartItems = signal<Game[]>([]);

  // 2. Expose the signal as a read-only computed value
  cart = computed(() => this.cartItems());

  // 3. Define a computed signal that computes total cart items
  totalItems = computed(() => this.cartItems().length);

  // 4. Define a computed signal that computes total cart cost
  totalPrice = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + Number(item.price), 0);
  });

  constructor() {
    // Load initial state from localStorage if available
    const saved = localStorage.getItem('cart_items');
    if (saved) {
      try {
        this.cartItems.set(JSON.parse(saved));
      } catch {
        localStorage.removeItem('cart_items');
      }
    }

    // 5. Setup an effect to save cart contents to localStorage automatically
    effect(() => {
      const items = this.cartItems();
      localStorage.setItem('cart_items', JSON.stringify(items));
      console.log(`[Cart State] Updated: ${items.length} items logged.`);
    });
  }

  // Add game to cart
  addToCart(game: Game): void {
    // Use update() to append a game to the existing array safely
    this.cartItems.update(items => [...items, game]);
  }

  // Remove game from cart (removes first matching instance)
  removeFromCart(gameId: number): void {
    this.cartItems.update(items => items.filter(item => item.id !== gameId));
  }

  // Clear all cart items
  clearCart(): void {
    this.cartItems.set([]); // Reset the signal value to an empty array
  }
}
