import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirdInfoService {
  private WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

  constructor(private http: HttpClient) { }

  getBirdInfo(birdName: string): Promise<any> {
    const cleanedName = birdName.split('/')[0].trim();
    const encodedName = encodeURIComponent(birdName.trim());
    const url = `${this.WIKIPEDIA_API_URL}${encodedName}`;

    return this.http.get<any>(url).toPromise();
  }
}
