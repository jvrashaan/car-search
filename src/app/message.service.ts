import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  private subject = new Subject<any>();

  constructor() { }
  
  sendMessage(message: string){
    this.subject.next({ text: message});
  }
  
  sendMessage2(message: any[] ){
    this.subject.next({ text: message});
  }
  
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
