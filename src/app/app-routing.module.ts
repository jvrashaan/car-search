import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CarSearchComponent } from './car-search/car-search.component';
import { HeaderComponent } from './header/header.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ExploreComponent } from './explore/explore.component';
import { RecommendedComponent } from './recommended/recommended.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'favorites', component: FavoritesComponent},
    { path: 'home', component: CarSearchComponent },
    { path: 'explore', component: ExploreComponent },
    { path: 'recommended', component: RecommendedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
