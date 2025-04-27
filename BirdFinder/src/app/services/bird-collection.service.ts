/**
* Bird Collection Service
* 
* This service handles all interactions with the backend MongoDB database
* for storing and retrieving the user's bird collection.
* It provides methods to save, fetch, check for, and delete birds from the collection.
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirdCollectionService {
  private apiUrl = 'http://localhost:5000';

  /**
    * Constructor for BirdCollectionService
    * 
    * @param http Angular HttpClient for making API requests
    */
  constructor(private http: HttpClient) { }

  /**
  * Saves a new bird to the MongoDB database
  * 
  * @param bird The bird object to be saved
  * @returns Promise that resolves to the server response
  */
  async saveBird(bird: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.apiUrl}/saveBird`, bird).toPromise();
      return response;
    } catch (error) {
      console.error('Error saving bird to MongoDB:', error);
      throw error;
    }
  }

  /**
  * Retrieves all saved birds from the MongoDB database
  * 
  * @returns Promise that resolves to an array of bird objects
  */
  getSavedBirds(): Promise<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/birds`).toPromise()
      .then(response => response || [])
      .catch(error => {
        console.error('Error fetching birds:', error);
        return [];
      });
  }

  /**
  * Deletes a bird from the MongoDB database by ID
  * 
  * @param birdId The MongoDB _id of the bird to delete
  * @returns Promise that resolves to the server response
  */
  deleteBird(birdId: string): Promise<any> {
    return this.http.delete(`${this.apiUrl}/birds/${birdId}`).toPromise()
      .then(response => {
        return response;
      })
      .catch(error => {
        console.error('Error deleting bird from MongoDB:', error);
        throw error;
      });
  }

  /**
  * Checks if a bird with the given name already exists in the user's collection
  * 
  * @param birdName The name of the bird to check for
  * @returns Promise that resolves to boolean indicating if bird exists in collection
  */
  async hasBirdInCollection(birdName: string): Promise<boolean> {
    try {
      const birds = await this.getSavedBirds();

      const foundBird = birds.find(bird =>
        bird.name.toLowerCase() === birdName.toLowerCase()
      );

      return !!foundBird;
    } catch (error) {
      console.error('Error checking if bird is in collection:', error);
      return false;
    }
  }
}
