import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirdIdentificationService {
  private GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
  private GEMINI_API_KEY = 'AIzaSyCSNoZIQ4oW0q1RorP5nEE4iebhsoBZpWg';

  constructor(private http: HttpClient) { }

  async identifyBird(base64Image: string): Promise<string> {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are an expert ornithologist. Given a photo of a bird, identify the bird species and return the following information in structured JSON format:
            {
              "commonName": "",
              "scientificName": "",
              "habitat": "",
              "rarity": "",
              "funFact": "",
              "shortDescription": ""
            }

            - commonName: The common name of the bird.
            - scientificName: The scientific (Latin) name.
            - habitat: The typical habitat of this bird.
            - rarity: One of Common, Uncommon, Rare.
            - funFact: One interesting real fact about the bird.
            - shortDescription: A brief 2-3 sentence description of the bird.

            If you cannot identify the bird, return: {"commonName": "Unknown", "scientificName": "", "habitat": "", "rarity": "", "funFact": "", "shortDescription": ""}`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1]
              }
            }
          ]
        }
      ]
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`;

    const response = await this.http.post<any>(url, requestBody, { headers }).toPromise();
    console.log('Gemini raw response:', response);

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    console.log('Cleaned Gemini response:', cleanedText);


    const birdInfo = JSON.parse(cleanedText);
    return birdInfo;
  }

  async getBirdInfoByName(birdName: string): Promise<any> {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are an expert ornithologist. I want information about ${birdName}. Return the following information in structured JSON format:
              {
                "commonName": "",
                "scientificName": "",
                "habitat": "",
                "rarity": "",
                "funFact": "",
                "shortDescription": "",
                "diet": "",
                "behavior": "",
                "lifespan": "",
                "conservationStatus": ""
              }
  
              - commonName: The common name of the bird (should match ${birdName}).
              - scientificName: The scientific (Latin) name.
              - habitat: The typical habitat of this bird.
              - rarity: One of Common, Uncommon, Rare.
              - funFact: One interesting real fact about the bird.
              - shortDescription: A 2-3 sentence description of the bird.
              - diet: What the bird typically eats.
              - behavior: Common behaviors or habits.
              - lifespan: Average lifespan in years.
              - conservationStatus: Conservation status (e.g., Least Concern, Vulnerable, Endangered)
  
              If you cannot identify the bird, return: {"commonName": "Unknown", "scientificName": "", "habitat": "", "rarity": "", "funFact": "", "shortDescription": ""}`
            }
          ]
        }
      ]
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`;

    try {
      const response = await this.http.post<any>(url, requestBody, { headers }).toPromise();
      console.log('Gemini raw response:', response);

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

      const cleanedText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      console.log('Cleaned Gemini response:', cleanedText);

      const birdInfo = JSON.parse(cleanedText);
      return birdInfo;
    } catch (error) {
      console.error('Error getting bird info from Gemini:', error);
      return {
        commonName: birdName,
        scientificName: "",
        habitat: "",
        rarity: "",
        funFact: "No information available.",
        shortDescription: "Information about this bird could not be retrieved."
      };
    }
  }

}
