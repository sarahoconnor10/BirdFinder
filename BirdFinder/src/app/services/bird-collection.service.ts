import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirdCollectionService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  async saveBird(bird: any): Promise<any> {
    try {
      console.log('Saving bird to MongoDB:', bird);
      const response = await this.http.post(`${this.apiUrl}/saveBird`, bird).toPromise();
      console.log('Bird saved to MongoDB successfully:', response);
      return response;
    } catch (error) {
      console.error('Error saving bird to MongoDB:', error);
      throw error;
    }
  }

  getSavedBirds(): Promise<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/birds`).toPromise()
      .then(response => response || [])
      .catch(error => {
        console.error('Error fetching birds:', error);
        return [];
      });
  }

  deleteBird(birdId: string): Promise<any> {
    return this.http.delete(`${this.apiUrl}/birds/${birdId}`).toPromise()
      .then(response => {
        console.log('Bird deleted from MongoDB:', response);
        return response;
      })
      .catch(error => {
        console.error('Error deleting bird from MongoDB:', error);
        throw error;
      });
  }
}
