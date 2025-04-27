/**
* Bird Search Service
* 
* This service provides functionality to search for birds using Wikipedia's API
* and enrich the results with images from the BirdImageService.
* It allows users to find bird species based on search terms.
*/

import { Injectable } from '@angular/core';
import { BirdImageService } from './bird-image.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirdSearchService {

  /**
  * Constructor for BirdSearchService
  * 
  * @param http Angular HttpClient for making API requests
  * @param birdImageService Service to retrieve bird images
  */
  constructor(
    private http: HttpClient,
    private birdImageService: BirdImageService
  ) { }

  /**
  * Searches for birds matching the provided query using Wikipedia's search API
  * and enriches results with images
  * 
  * @param query The search term to look for birds
  * @returns Promise that resolves to an array of bird objects with names, snippets, and images
  */
  async searchBirds(query: string): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}%20bird&format=json&origin=*&srlimit=15`;

      const wikiResponse = await firstValueFrom(this.http.get<any>(wikiUrl));

      const searchResults = wikiResponse.query.search;

      const enrichedBirds = await Promise.all(
        searchResults.map(async (result: any) => {
          const birdName = result.title.replace(/ \(.*?\)/, '');

          try {
            const imageUrl = await this.birdImageService.getBirdImageUrl(birdName);

            const snippet = this.stripHtmlTags(result.snippet);

            return {
              name: birdName,
              scientificName: '',
              snippet: snippet,
              image: imageUrl || 'assets/placeholder.png' // Fallback image if none found
            };
          } catch (error) {
            console.error(`Error getting image for ${birdName}:`, error);
            return null;
          }
        })
      );

      return enrichedBirds.filter(bird => bird !== null);
    } catch (error) {
      console.error('Error searching birds:', error);
      return [];
    }
  }

  /**
  * Removes HTML tags from a string
  * 
  * @param html String containing HTML tags
  * @returns Clean string with HTML tags removed
  */
  private stripHtmlTags(html: string): string {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }
}
