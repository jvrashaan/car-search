import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs/Subscription';
import { Message2Service } from '../message2.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.css']
})
export class RecommendedComponent implements OnInit {

  Cars = [];
  save = [];
  tempTags = <any>[];
  Tags = [];
  temp = [];
  tag = '';
  message: any;
  subscription: Subscription;
  
  classes = ['economy car', 'economy', 'traffic', 'cab', 'luxury car', 'luxury', 'supercar', 'hypercar', 'sportcar', 'limousine', 'muscle car', 'pony car', 'sports sedan', 'racing car', 'hot rod', 'low rider', 'drift car', 'rally car', 'dragster', 'offroad car', 'military car', 'kit car', 'go kart', 'grand prix car', 'formula one race car', 'stock car', 'vintage car', 'classic car', 'taxi cab', 'car', 'vehicle', 'antique car', 'sport coupe', 'cabriolet', 'auto'];
  
  companies = ['acura', 'alfa romeo', 'aston martin', 'audi', 'bentley', 'bmw', 'bugatti', 'buick', 'cadillac', 'chevrolet', 'chrylser cars', 'citroen', 'dodge', 'ferrari', 'fiat', 'ford', 'gmc', 'honda', 'hyundai', 'infiniti', 'jaguar', 'jeep', 'kia', 'koenigsegg', 'lamborghini', 'land rover', 'lexus', 'maserati', 'mazda', 'mcLaren', 'mercedes-benz', 'mini cooper', 'mitsubishi', 'nissan', 'pagani', 'peugeot', 'porsche', 'ram trucks', 'renault', 'rolls royce', 'saab', 'subaru', 'suzuki', 'tesla', 'toyota', 'volkswagen', 'volvo'];
  
  //Shared Service w/ car search. Recieves results.  
  constructor(private messageService: MessageService, private message2Service: Message2Service, public searchService: SearchService) { 
    this.subscription = this.message2Service.getMessage().subscribe(message => {  
        //console.log("Message received from car-search:");
        this.Cars = message['text'];
        });
  }

  ngOnInit() {
    this.recommendations();
  }
  
  //Gathers recommendations based on past searches and saved photos.
  recommendations(){
    try{
        this.searchService.getTags()
        .subscribe( resp => {
            this.tempTags = resp;
            this.filter(this.tempTags);
            this.sendMessages(this.Tags);
        }, 
            error => {
                console.log(error, "error");
            })
    } catch(e) {
        console.log(e);
    }
  }
  
  //filter out unusable tags
  filter(tempTags){
    for(var i = 0; i < tempTags.length; i++){
        this.temp = tempTags[i]['tags'];
        this.temp = this.temp.toString().split(",");
        for(var j = 0; j < this.temp.length; j++){
            this.tag = this.temp[j];
            if(this.verify(this.tag)){
                this.Tags.push(this.tag);
            }
        }
    }
  }
  
  //helper function compares individual tags to list of valid tags.
  verify(tag){
    for(var i = 0; i < this.companies.length; i++){
        if(tag == this.companies[i]){
            if(!this.exists(tag)){
                return true;
            }
        }
    }
    for(var j = 0; j < this.classes.length; j++){
        if(tag == this.classes[i]){
            if(!this.exists(tag)){
                return true;
            }
        }
    }
    
    return false;
  }
  
  //helper function returns true if a tag is a duplicate.
  exists(tag){
    for(var i = 0; i < this.Tags.length; i ++){
        if(tag == this.Tags[i]){
            return true;
        }
    }
     return false;
  }
  
  //Sends recommendation requests to car search component.
  sendMessages(recommend): void {
    this.messageService.sendMessage("recommend");
    this.messageService.sendMessage(recommend);
    //console.log("Query sent from Recommendations");
  }
  
  //Sends save request to car search component. 
  sendSave(webformatURL, tags, id){
    this.messageService.sendMessage("save");
    this.save = [webformatURL, tags, id];
    this.messageService.sendMessage2(this.save);
    //console.log("Save request sent from recommendations");
  }
  

}
