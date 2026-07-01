import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameService, Game } from '../../services/game';
import { CartService } from '../../services/cart';
import { GameCardComponent } from '../game-card/game-card';

@Component({
  selector: 'app-game-list',
  imports: [
    CommonModule,
    GameCardComponent
  ],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css'
})
export class GameList implements OnInit {

  // Use Angular Signal for games list to support Zoneless reactive rendering
  games = signal<Game[]>([]);

  constructor(
    private gameService: GameService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames(): void {
    this.gameService.getGames().subscribe({
      next: (games) => {
        console.log('Fetched games:', games);
        this.games.set(games);
      },
      error: (err) => {
        console.error('Fetch games error:', err);
      }
    });
  }

  addToCart(game: Game): void {
    this.cartService.addToCart(game);
  }

  toggleAvailability(game: Game): void {
    // Update the signal value reactively
    this.games.update(currentGames => 
      currentGames.map(g => g.id === game.id ? { ...g, available: !g.available } : g)
    );
  }
}