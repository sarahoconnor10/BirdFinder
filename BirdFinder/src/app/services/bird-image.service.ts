import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BirdImageService {

  constructor(private http: HttpClient) { }

  async getBirdImageUrl(birdName: string): Promise<string | null> {
    const encodedName = encodeURIComponent(birdName.trim());

    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=500&origin=*`;

    try {
      const response: any = await this.http.get(url).toPromise();
      const pages = response.query.pages;

      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (page && page.thumbnail && page.thumbnail.source) {
        return page.thumbnail.source;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching bird image:', error);
      return null;
    }
  }
}
