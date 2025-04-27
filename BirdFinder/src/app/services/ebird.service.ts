import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EbirdService {
  private API_KEY = 'fptrp93c4u6a';
  private API_URL = 'https://api.ebird.org/v2/data/obs/geo/recent';

  constructor(private http: HttpClient) { }

  getNearbyBirds(lat: number, lon: number): Promise<any[]> {
    const headers = new HttpHeaders({
      'X-eBirdApiToken': this.API_KEY
    });

    const url = `${this.API_URL}?lat=${lat}&lng=${lon}&maxResults=10`;
    console.log(url);
    return this.http.get<any[]>(url, { headers }).toPromise()
      .then(response => response || [])
      .catch(error => {
        console.error('eBird API error:', error);
        return [];
      });
  }

}
