import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarSearchComponent } from './car-search/car-search.component';

import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FavoritesComponent } from './favorites/favorites.component';
import { ExploreComponent } from './explore/explore.component';
import { RecommendedComponent } from './recommended/recommended.component';

import { MessageService } from './message.service';
import { SearchService } from './search.service';

@NgModule({
  declarations: [
    AppComponent,
    CarSearchComponent,
    HeaderComponent,
    FavoritesComponent,
    ExploreComponent,
    RecommendedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [MessageService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
