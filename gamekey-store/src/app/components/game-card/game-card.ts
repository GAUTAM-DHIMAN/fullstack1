import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Game } from '../../services/game';
import { DiscountPipe } from '../../pipes/discount.pipe';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, RouterLink, DiscountPipe],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css'
})
export class GameCardComponent {
  // @Input: receive game data from parent component
  @Input({ required: true }) game!: Game;

  // @Output: emit event when user clicks "Add to Cart"
  @Output() addToCart = new EventEmitter<Game>();

  // @Output: emit event when user clicks "Toggle Availability"
  @Output() toggleAvailability = new EventEmitter<Game>();

  onAddToCart(): void {
    this.addToCart.emit(this.game);
  }

  onToggle(): void {
    this.toggleAvailability.emit(this.game);
  }
}
