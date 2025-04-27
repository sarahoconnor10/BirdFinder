import { Injectable } from '@angular/core';
import { BirdImageService } from './bird-image.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BirdSearchService {

  constructor(
    private http: HttpClient,
    private birdImageService: BirdImageService
  ) { }

  async searchBirds(query: string): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}%20bird&format=json&origin=*&srlimit=15`;

      const wikiResponse = await firstValueFrom(this.http.get<any>(wikiUrl));
      console.log('Wikipedia search results:', wikiResponse);

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

  private stripHtmlTags(html: string): string {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }
}
