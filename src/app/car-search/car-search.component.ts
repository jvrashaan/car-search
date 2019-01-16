import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs/Subscription';
import { Message2Service } from '../message2.service';

@Component({
  selector: 'app-car-search',
  templateUrl: './car-search.component.html',
  styleUrls: ['./car-search.component.css']
})

export class CarSearchComponent implements OnInit {
  
  query = '';
  Cars = <any>[];
  Cars2 = <any>[];
  queries = [];
  results = <any>[];
  noResults;
  
  companies = ['Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick', 'Cadillac', 'Chevrolet', 'Chrylser Cars', 'Citroen', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'GMC', 'Honda', 'Hyundai', 'infiniti', 'Jaguar', 'Jeep', 'Kia', 'Koenigsegg', 'Lamborghini', 'Land Rover', 'Lexus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini Cooper', 'Mitsubishi', 'Nissan', 'Pagani', 'Peugeot', 'Porsche', 'Ram Trucks', 'Renault', 'Rolls Royce', 'Saab', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'];
  
  classes = ['economy car', 'economy', 'traffic', 'cab', 'luxury car', 'luxury', 'supercar', 'hypercar', 'sportcar', 'limousine', 'muscle car', 'pony car', 'sports sedan', 'racing car', 'hot rod', 'low rider', 'drift car', 'rally car', 'dragster', 'offroad car', 'military car', 'kit car', 'go kart', 'grand prix car', 'formula one race car', 'stock car', 'vintage car', 'classic car', 'taxi cab', 'car', 'cars', 'vehicle', 'antique car', 'sport coupe', 'cabriolet', 'auto', 'automobile', 'suv', 'pickup truck', 'pickup', 'truck', 'trucks', 'vehicles', 'pickups', 'suvs', 'automobiles', 'cabriolets', 'convertibles', 'convertible'];
  
  message: any;
  subscription: Subscription;
  flag = -1;
  
  //Shared Service with other components. Responds to requests for category car searches and photo saves.
  constructor(public searchService: SearchService, private messageService: MessageService, private message2Service: Message2Service) { 
    this.subscription = this.messageService.getMessage().subscribe(message => { 
        if(message['text'] == 'query'){
            //search request
            this.flag = 2;
            
        } else if(this.flag == 2) {
            //preform the search
            //console.log("query received from Explore:");
            this.Cars2 = <any>[];
            this.message = message['text'];
            //Check if cache needs to be cleared.
            if(this.isFull()){
                //clear oldest search
                var temp = this.queries.shift();
                this.deleteCars(temp);
            }
            //check if search is in the cache already
            try{
                this.searchService.getCarsDB(this.message)
                .subscribe(resp => {
                    //console.log(resp, "res");
                    //check if data is valid
                    if(this.validate(resp)){
                        //console.log("Data found in DB");
                        this.Cars2 = resp;
                        this.sendMessages();
                    } else {
                        //get data from api call
                        try {
                            this.searchService.getCarsAPI(this.message)
                            .subscribe(resp => {
                                //console.log(resp, "res");
                                this.Cars2 = resp['hits'];
                                this.sendMessages();
                                this.saveCars(this.Cars2, this.message);
                            },
                                error => {
                                    console.log(error, "error");
                                })
                        } catch (e) {
                            console.log(e);
                        }
                    }
            },
                error => {
                    console.log(error, "error");
                })
                
            } catch (e) {
                console.log(e);
            }
            this.flag = -1; 
            
        } else if(message['text'] == 'save'){
            //save request
            this.flag = 1;
            
        } else if(this.flag == 1) {
            //preform the save
            //console.log("save recieved from Explore/Recommendations");
            this.saveCar(message['text'][0], message['text'][1], message['text'][2], message['text'][3]);
            this.flag = -1;
            
        } else if(message['text'] == 'recommend'){
            //recommendation request
            this.flag = 0;
            
        } else if(this.flag == 0){
            this.Cars2 = <any>[];
            //console.log("recommendation request received from Recommendations");
            this.message = message['text'];
            //iterate through the tags and get results
            for(var i = 0; i < this.message.length; i++){
                //Make api call for all recommendations. 
                try{
                    this.searchService.getCarsAPI(this.message[i])
                    .subscribe(resp => {
                        //console.log(resp, "resAPI");
                        for(var i = 0; i < resp['hits'].length; i++){
                            this.Cars2.push(resp['hits'][i]);
                        }
                    },
                        error => {
                            console.log(error, "error");
                        })
                    } catch (e) {
                                console.log(e);
                        }      
            }
            //console.log(this.Cars2);
            this.sendMessages();
            this.flag = -1;
            
        } else {
            console.log("Error with request");
        }
    });
  }
  
  //sends results back to requesting component
  sendMessages(): void {
    this.message2Service.sendMessage2(this.Cars2);
  }
  
  //initialize results at startup
  ngOnInit() {
    this.getCars("sports car");
  }
  
  //Get Cars from database or API
  getCars(query) {
    var q = query.toLowerCase();
    //Check if the query is car related.
    if(!this.isGood(query)){
        this.noResults = "Error, incorrect search term. Please search another term.";
        
    } else {
        this.noResults = "";
        //Check if cache needs to be cleared.
        if(this.isFull()){
            //clear oldest search
            var temp = this.queries.shift();
            this.deleteCars(temp);
        }

        //check if search is in the cache already, if not make api call. 
        try{
            this.searchService.getCarsDB(q)
                .subscribe(resp => {
                    //console.log(resp, "res");
                    this.Cars = resp;
                    //check if data is valid
                    if(this.validate(this.Cars)){
                        //console.log("Data found in DB");
                    } else {
                        //get data from api call
                        try {
                            this.searchService.getCarsAPI(q)
                                .subscribe(resp => {
                                    //console.log(resp, "res");
                                    this.Cars = resp['hits'];
                                    this.saveCars(this.Cars, q);
                                },
                                    error => {
                                        console.log(error, "error");
                                    })
                            } catch (e) {
                                console.log(e);
                            }
                    }
                },
                    error => {
                        console.log(error, "error");
                    })
            } catch (e) {
                console.log(e);
            }
        }
    }
    
    //Checks if the query is car related.
    isGood(query):boolean{
        var temp = query.split(" ");
        var array = <any>[];
        
        for(var i = 0; i < temp.length; i++){
            array.push(temp[i].toLowerCase());
        }
        
        for(var i = 0; i < array.length; i++){
            var word = array[i];
            for(var j = 0; j < this.companies.length; j++){
                if(word == this.companies[j].toLowerCase()){
                    return true;
                }
            }
            
            for(var k = 0; k < this.classes.length; k++){
                if(word == this.classes[k]){
                    return true;
                }
            }
        }
        
        return false;
    }
    
    //Save to Database
    saveCars(cars, query){
        this.queries.push(query);
        try {    
            this.searchService.postCars(cars, query)
            .subscribe(resp => {
                //console.log(resp, "res");
                },
                    error => {
                        console.log(error, "error");
                        })
            } catch (e) {
                console.log(e);
            }
    }
    
    //Delete oldest car search from database
    deleteCars(query){
        try{
            this.searchService.deleteCars(query)
            .subscribe(resp => {
                //console.log(resp, "res");
                },
                    error => {
                        console.log(error, "error");
                    })
        } catch (e){
            console.log(e);
        }
    }
    
    //Helper function
    validate(resp): boolean {
        //console.log(resp)
        //check if response is valid
        if(resp.length != 0){
            //console.log("results found");
            return true;
        } else {
            //console.log("no results found");
            return false;
        }
    }
    
    //tracks number of searches, deletes old results from cache.
    isFull(){
        if(this.queries.length >= 10){
            return true;
        } else {
            return false;
        }
    }
    
    //save photo to favorites
    saveCar(webformatURL, tags, id, user){
        try {
            this.searchService.saveCarDB(webformatURL, tags, id, user)
            .subscribe(resp => {
                //console.log(resp);
            }, error => {
                console.log(error, "error");
                })
        } catch(e) {
            console.log(e);
        }
    }
    
}
