import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  Cars = <any>[];
  noCars = true;

  constructor(public searchService: SearchService) {
  }

  ngOnInit() {
    this.getSaved();
  }
  
  //get saved photos
  getSaved(){
    try {
        this.searchService.getFavorites()
        .subscribe(resp => {
            this.Cars = resp;
            this.auth(this.Cars);
            }, 
                error => {
                    console.log(error, "error")
            })
        } catch(e){
            console.log(e);
        }
    }
    
  auth(Cars){
    if(Cars.length > 0){
        this.noCars = false;
    } else {
        this.noCars = true;
    }
  }
    
  //remove saved photo    
  removeCar(webformatURL){
    try {
        this.searchService.removeCar(webformatURL)
        .subscribe(resp => {
            //console.log(resp);
            this.getSaved();
            },
                error => {
                    console.log(error, "error")
                })
        } catch(e){
            console.log(e);
        }
    }
}
