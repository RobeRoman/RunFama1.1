import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  url_weather: string = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=-33.59850527332617&lon=-70.5787656165388";


  url_mindicador: string = "https://mindicador.cl/api";
  constructor(private http: HttpClient) {}

  getDatosWeather() {
    return this.http.get(this.url_weather);
  }
  

  getDatos(){
    return this.http.get(this.url_mindicador);
  }
}