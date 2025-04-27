/**
* eBird Service
* 
* This service provides functionality to retrieve recent nearby bird observations
* using the eBird API and search for bird species using Cornell's taxonomy API.
* It allows fetching bird sightings by location and finding birds by search terms.
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
* Interface defining the structure of a bird record 
*/
interface CornellBirdTaxonomy {
  commonName: string;
  name: string;
  scientificName: string;
  familyCommonName: string;
  order: string;
  familyCode: string;
  familySciName: string;
  speciesCode: string;
  category: string;
  taxonOrder: number;
  bandingCodes: string[];
  comNameCodes: string[];
  sciNameCodes: string[];
  orderComName: string;
  extinct: boolean;
  extinctYear?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EbirdService {
  private API_KEY = 'fptrp93c4u6a';
  private API_URL = 'https://api.ebird.org/v2/data/obs/geo/recent';
  private SEARCH_API_URL = 'https://taxonomy.api.birds.cornell.edu/api/v1/taxonomy/search';

  /**
  * Constructor for EbirdService
  * 
  * @param http Angular HttpClient for making API requests
  */
  constructor(private http: HttpClient) { }

  /**
  * Retrieves recent bird observations near the specified latitude and longitude
  * using the eBird API
  * 
  * @param lat Latitude of the location
  * @param lon Longitude of the location
  * @returns Promise that resolves to an array of recent bird sightings
  */
  getNearbyBirds(lat: number, lon: number): Promise<any[]> {
    const headers = new HttpHeaders({
      'X-eBirdApiToken': this.API_KEY
    });

    const url = `${this.API_URL}?lat=${lat}&lng=${lon}&maxResults=10`;
    return this.http.get<any[]>(url, { headers }).toPromise()
      .then(response => response || [])
      .catch(error => {
        console.error('eBird API error:', error);
        return [];
      });
  }

  /**
  * Searches for birds matching the provided query using Cornell's taxonomy API
  * 
  * @param query The search term to look for birds
  * @returns Promise that resolves to an array of bird objects with name, scientific name, family, and order
  */
  async searchBirds(query: string): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const url = `${this.SEARCH_API_URL}?q=${encodeURIComponent(query)}`;

      const response = await firstValueFrom(this.http.get<CornellBirdTaxonomy[]>(url));

      return response.map((bird: CornellBirdTaxonomy) => ({
        name: bird.commonName || bird.name,
        scientificName: bird.scientificName,
        familyComName: bird.familyCommonName,
        order: bird.order
      }));
    } catch (error) {
      console.error('Bird search error:', error);
      return [];
    }
  }
}
