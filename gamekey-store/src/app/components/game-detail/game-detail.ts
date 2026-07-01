import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { GameService, Game } from '../../services/game';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css'
})
export class GameDetail implements OnInit {

  // Use Angular Signal for single game to support Zoneless reactive rendering
  game = signal<Game | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.gameService.getGameById(id).subscribe({
        next: (game) => {
          this.game.set(game);
        },
        error: (err) => {
          console.error('Failed to load game:', err);
          this.game.set(undefined);
        }
      });
    }
  }
}