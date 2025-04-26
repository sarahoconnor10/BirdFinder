import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BirdIdentificationService {
  private GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
  private GEMINI_API_KEY = 'AIzaSyCSNoZIQ4oW0q1RorP5nEE4iebhsoBZpWg';

  constructor(private http: HttpClient) { }


  identifyBird(base64Image: string): Promise<string> {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "Identify the bird species in this image. Only provide the name of the bird species."
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] // remove the 'data:image/jpeg;base64,' part
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

    return this.http.post<any>(url, requestBody, { headers }).toPromise()
      .then(response => {
        console.log('Gemini Response:', response);
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || 'Unknown bird';
      })
      .catch(error => {
        console.error('Error identifying bird:', error);
        throw new Error('Bird identification failed');
      });
  }
}
