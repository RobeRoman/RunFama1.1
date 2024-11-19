import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  apiId: string = '03a8ffdedd6f54cef80f1358aac1b7db';
  lat: number = -33.59850527332617;
  lon: number = -70.5787656165388;
  exclude: string = 'minutely,hourly';

  url_mindicador: string = "https://mindicador.cl/api";
  constructor(private http: HttpClient) {}

  getDatosWeather() {
    const urlWeather = `https://api.openweathermap.org/data/3.0/onecall?lat=${this.lat}&lon=${this.lon}&exclude=${this.exclude}&appid=${this.apiId}`;
    return this.http.get(urlWeather);
  }

  getDatos(){
    return this.http.get(this.url_mindicador);
  }
}