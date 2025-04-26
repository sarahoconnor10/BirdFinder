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
    const encodedName = encodeURIComponent(cleanedName);
    const url = `${this.WIKIPEDIA_API_URL}${encodedName}`;

    return this.http.get<any>(url).toPromise();
  }

  async getBirdInfoINat(birdName: string) {
    const cleanedName = birdName.split('/')[0].trim();
    const encodedName = encodeURIComponent(cleanedName);
    const url = `https://api.inaturalist.org/v1/taxa?q=${encodedName}&rank=species`;
    try {
      const response: any = await this.http.get(url).toPromise();
      const result = response.results[0];

      if (!result) {
        throw new Error('No bird found.');
      }

      return {
        commonName: result.preferred_common_name || '',
        scientificName: result.name || '',
        family: result.family?.name || '',
        genus: result.genus?.name || '',
        imageUrl: result.default_photo?.medium_url || '',
        wikiUrl: result.wikipedia_url || ''
      };
    } catch (error) {
      console.error('Error fetching bird data from iNaturalist:', error);
      throw error;
    }
  }
}
