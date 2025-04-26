import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLinkWithHref } from '@angular/router';
import { BirdInfoService } from 'src/app/services/bird-info.service';
import { BirdCollectionService } from 'src/app/services/bird-collection.service';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLinkWithHref]
})
export class ResultPage {
  birdName: string = "Unknown";
  capturedImage: string = "";
  professionalImageUrl: string = "";
  birdInfo: string = "Unknown";
  scientificName: string = "Unknown";
  birdFunFact = "";

  constructor(private router: Router,
    private birdInfoService: BirdInfoService,
    private birdCollectionService: BirdCollectionService,
    private toastController: ToastController
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
      this.loadBirdFunFact();

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

  async saveToCollection() {
    const bird = {
      name: this.birdName,
      image: this.capturedImage,
      date: new Date().toISOString()
    };

    this.birdCollectionService.saveBird(bird);
    console.log('Bird saved:', bird);

    const toast = await this.toastController.create({
      message: 'Bird saved to collection!',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });

    await toast.present();
  }

  loadBirdFunFact() {
    const facts = [
      `${this.birdName}s can fly up to 50 km/h!`,
      `${this.birdName}s often migrate across continents.`,
      `${this.birdName}s are known for their unique songs.`,
      `A group of ${this.birdName}s is called a flock.`,
      `The ${this.birdName} can live up to 15 years in the wild.`
    ];

    this.birdFunFact = facts[Math.floor(Math.random() * facts.length)];
  }

}
