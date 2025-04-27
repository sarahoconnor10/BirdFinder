/**
* Bird Image Service
* 
* This service retrieves bird images from Wikipedia using their API.
* It formats bird names appropriately and handles API communication and response processing.
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirdImageService {

  /**
    * Constructor for BirdImageService
    * 
    * @param http Angular HttpClient for making API requests
    */
  constructor(private http: HttpClient) { }

  /**
  * Retrieves an image URL for a specified bird from Wikipedia
  * 
  * @param birdName The name of the bird to find an image for
  * @returns Promise that resolves to an image URL or null if not found
  */
  async getBirdImageUrl(birdName: string): Promise<string | null> {
    if (!birdName) return null;

    const cleanName = this.capitalizeWords(birdName.trim());
    const encodedName = encodeURIComponent(cleanName);

    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
      const response: any = await this.http.get(url).toPromise();

      const pages = response.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (page && page.thumbnail && page.thumbnail.source) {
        return page.thumbnail.source;
      }
    } catch (error) {
      console.warn(`Wikipedia image lookup failed for ${birdName}:`, error);
    }
    return null;
  }

  /**
  * Capitalizes the first letter of each word in a string
  * 
  * @param name The string to capitalize
  * @returns The capitalized string
  */
  capitalizeWords(name: string): string {
    return name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  }
}
