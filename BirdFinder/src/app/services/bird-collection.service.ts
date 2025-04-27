import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirdCollectionService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  saveBird(bird: any) {
    return this.http.post(`${this.apiUrl}/saveBird`, bird).toPromise();
  }

  getSavedBirds(): Promise<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/birds`).toPromise()
      .then(response => response || [])
      .catch(error => {
        console.error('Error fetching birds:', error);
        return [];
      });
  }
}
