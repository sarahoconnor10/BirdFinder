import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouterLinkWithHref } from '@angular/router';
import { BirdInfoService } from 'src/app/services/bird-info.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, RouterLinkWithHref]
})
export class ResultPage {
  birdName: string = "Unknown";
  capturedImage: string = "";
  professionalImageUrl: string = "";
  birdInfo: string = "Unknown";
  scientificName: string = "Unknown";

  constructor(private router: Router,
    private birdInfoService: BirdInfoService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { birdName: string, capturedImage: string };

    if (state && state.birdName) {
      this.birdName = state.birdName;
      this.capturedImage = state.capturedImage;
    }
  }

  ionViewWillEnter() {
    this.loadBirdInfo();
  }

  async loadBirdInfo() {
    try {
      const info = await this.birdInfoService.getBirdInfo(this.birdName);

      console.log('Wikipedia info:', info);

      this.professionalImageUrl = info.thumbnail?.source || '';
      this.birdInfo = info.extract || 'No additional information found.';
      this.scientificName = this.extractScientificName(info.extract);
    } catch (error) {
      console.error("Error fetching bird info:", error);
      this.birdInfo = "Could not find information about this bird.";
    }
  }

  extractScientificName(text: string): string {
    if (!text) return '';

    // find first italicized word 
    const match = text.match(/\b([A-Z][a-z]+ [a-z]+)\b/);

    return match ? match[1] : 'Unknown';
  }

}
