import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BirdImageService {

  constructor(private http: HttpClient) { }

  async getBirdImageUrl(birdName: string): Promise<string | null> {
    if (!birdName) return null;

    const cleanName = this.capitalizeWords(birdName.trim());
    const encodedName = encodeURIComponent(cleanName);

    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=500&origin=*`;

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

  capitalizeWords(name: string): string {
    return name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  }
}
