import { Routes } from '@angular/router';

import { GameList } from './components/game-list/game-list';
import { GameDetail } from './components/game-detail/game-detail';
import { AddGameFormComponent } from './components/add-game-form/add-game-form.component';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'games',
    pathMatch: 'full'
  },
  {
    path: 'games',
    component: GameList
  },
  {
    // Attach canActivate guard: routes to 'games/add' will check authGuard first!
    path: 'games/add',
    component: AddGameFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'games/:id',
    component: GameDetail
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: 'games'
  }
];