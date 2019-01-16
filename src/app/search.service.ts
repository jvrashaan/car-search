import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class SearchService {

    terms = [];

    constructor(private http: HttpClient){}
    
    //Fetch cars directly from api.
    getCarsAPI(query){
        var url = "https://pixabay.com/api/?key=keyyyy&q=";         
        var end = "&image_type=photo&pretty=true";
        return this.http.get(url + query + end); 
    }
    
    
    //Fetch cars from the db
    getCarsDB(query){
        const httpOptions = {
        headers: new HttpHeaders({
            'ResponseType':  'text',
            'params': query
            })
        };  
        //console.log("fetching term from cache:", query);
        return this.http.get("http://localhost:8000/GET", httpOptions);
    }
    
    //Save cars to database server.
    postCars(cars, query) {
        return this.http.post("http://localhost:8000/POST", {query, cars}, {responseType: 'text'});
    }
    
    //Delete oldest search results from the database
    deleteCars(query){
        const httpOptions = {
        headers: new HttpHeaders({
            'ResponseType':  'text',
            'params': query
            })
        }; 
        return this.http.delete("http://localhost:8000/DELETE", httpOptions);
    }
    
    //Save photo to favorites
    saveCarDB(webformatURL, tags, id, user){
        return this.http.post("http://localhost:8000/SAVE", {webformatURL, tags, id, user}, {responseType: 'text'});
    }
    
    //Get Favorites
    getFavorites(){
        return this.http.get("http://localhost:8000/SAVED");
    }
    
    //Get tags of saved photos and photos in the cache.
    getTags(){
        return this.http.get("http://localhost:8000/TAGS");
    }
    
    //remove saved photo
    removeCar(webformatURL){
        const httpOptions = {
        headers: new HttpHeaders({
            'ResponseType':  'text',
            'params': webformatURL
            })
        }; 
        return this.http.delete("http://localhost:8000/REMOVE", httpOptions);
    }
    
}
