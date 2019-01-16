import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs/Subscription';
import { Message2Service } from '../message2.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  classes = ['Economy Cars', 'Luxury Cars', 'Supercar', 'Hypercar', 'Sportcar', 'Limousine', 'Muscle cars', 'Pony cars', 'Sports sedans', 'Racing cars', 'Hot Rod', 'Low Rider', 'Drift Cars', 'Rally Cars', 'Dragster', 'Offroad Cars', 'Military cars', 'Kit Cars', 'Go Karts', 'Grand Prix Cars', 'Formula One Race Cars', 'Stock Cars', 'SUVS', 'Pickup Trucks'];
  
  Cars2 = <any>[];
  message: any;
  subscription: Subscription;
  save = [];

  //shared service with car search component. Receives search results.
  constructor(private messageService: MessageService, private message2Service: Message2Service) { 
    this.subscription = this.message2Service.getMessage().subscribe(message => {  
        //console.log("Message received from car-search:");
        this.Cars2 = message['text'];
        //console.log(message['text']);
        });
  }
  
  //Initialize page with first category.
  ngOnInit() {
    this.sendMessages("economy car");
  }
  
  //Sends category requests to car search component.
  sendMessages(query): void {
    this.messageService.sendMessage("query");
    this.messageService.sendMessage(query.toLowerCase());
    //console.log("Query sent from Explore");
  }
  
  //Sends save request to car search component. 
  sendSave(webformatURL, tags, id){
    this.messageService.sendMessage("save");
    this.save = [webformatURL, tags, id];
    this.messageService.sendMessage2(this.save);
    //console.log("Save request sent from explore");
  }
  
}
