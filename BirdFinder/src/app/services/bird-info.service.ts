import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface BirdDetails {
  commonName: string;
  scientificName: string;
  family: string;
  genus: string;
  imageUrl: string;
  wikiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class BirdInfoService {
  private WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
  private INAT_API_URL = 'https://api.inaturalist.org/v1/taxa?q=';

  constructor(private http: HttpClient) { }

  async getBirdDetails(birdName: string): Promise<BirdDetails> {
    try {
      const inatData = await this.getBirdInfoINat(birdName);
      return inatData;
    } catch (error) {
      console.warn('iNaturalist failed, trying Wikipedia...');
      const wikiData = await this.getBirdInfoWikipedia(birdName);
      return wikiData;
    }
  }


  async getBirdInfoWikipedia(birdName: string): Promise<BirdDetails> {
    const cleanedName = birdName.split('/')[0].trim();
    const encodedName = encodeURIComponent(cleanedName);
    const url = `${this.WIKIPEDIA_API_URL}${encodedName}`;

    try {
      const response: any = await this.http.get(url).toPromise();

      if (response.title === 'Not found.') {
        throw new Error('Wikipedia page not found.');
      }

      return {
        commonName: response.title || cleanedName,
        scientificName: '', // Wikipedia doesn't always give this
        family: '',
        genus: '',
        imageUrl: response.thumbnail?.source || '',
        wikiUrl: response.content_urls?.desktop?.page || '',
      };
    } catch (error) {
      console.error('Wikipedia error:', error);
      throw error;
    }
  }

  async getBirdInfoINat(birdName: string): Promise<BirdDetails> {
    const cleanedName = birdName.split('/')[0].trim();
    const encodedName = encodeURIComponent(cleanedName);
    const url = `${this.INAT_API_URL}${encodedName}&rank=species`;

    try {
      const response: any = await this.http.get(url).toPromise();
      const result = response.results[0];

      if (!result) {
        throw new Error('No bird found in iNaturalist.');
      }

      return {
        commonName: result.preferred_common_name || cleanedName,
        scientificName: result.name || '',
        family: result.family?.name || '',
        genus: result.genus?.name || '',
        imageUrl: result.default_photo?.medium_url || '',
        wikiUrl: result.wikipedia_url || ''
      };
    } catch (error) {
      console.error('iNaturalist error:', error);
      throw error;
    }
  }


}
