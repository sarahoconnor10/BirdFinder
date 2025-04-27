import { Injectable } from '@angular/core';
import { BirdImageService } from './bird-image.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BirdSearchService {
  private EBIRD_API_KEY = 'fptrp93c4u6a';
  private CORS_PROXY = 'https://corsproxy.io/?';
  private INATURALIST_API_URL = 'https://api.inaturalist.org/v1/taxa/autocomplete';

  constructor(
    private http: HttpClient,
    private birdImageService: BirdImageService
  ) { }

  async searchBirds(query: string): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      // Use Wikipedia's search API directly since it's working
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}%20bird&format=json&origin=*&srlimit=15`;

      const wikiResponse = await firstValueFrom(this.http.get<any>(wikiUrl));
      console.log('Wikipedia search results:', wikiResponse);

      // Process all search results - less strict filtering
      const searchResults = wikiResponse.query.search;

      // Process all results
      const enrichedBirds = await Promise.all(
        searchResults.map(async (result: any) => {
          // Clean up the title - remove (bird) suffix and other parentheses if present
          const birdName = result.title.replace(/ \(.*?\)/, '');

          try {
            const imageUrl = await this.birdImageService.getBirdImageUrl(birdName);

            // Extract a clean snippet without HTML tags
            const snippet = this.stripHtmlTags(result.snippet);

            return {
              name: birdName,
              scientificName: '', // Wikipedia search doesn't provide this directly
              snippet: snippet,
              image: imageUrl || 'assets/placeholder-bird.jpg' // Fallback image if none found
            };
          } catch (error) {
            console.error(`Error getting image for ${birdName}:`, error);
            return null;
          }
        })
      );

      // Filter out null results but keep entries even without images
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
