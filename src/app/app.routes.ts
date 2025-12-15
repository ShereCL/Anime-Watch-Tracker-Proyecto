import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AnimeDetail } from './pages/anime-detail/anime-detail';
import { MyList } from './pages/my-list/my-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'anime/:id', component: AnimeDetail },
  { path: 'my-list', component: MyList },
  { path: '**', redirectTo: '' },
];
