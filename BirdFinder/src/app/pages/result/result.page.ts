import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLinkWithHref } from '@angular/router';
import { BirdInfoService, BirdDetails } from 'src/app/services/bird-info.service';
import { BirdCollectionService } from 'src/app/services/bird-collection.service';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

interface SavedBird {
  name: string;
  scientificName: string;
  genus: string;
  image: string;
  date: string;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLinkWithHref, NavbarComponent]
})

export class ResultPage {
  birdName: string = "Unknown";
  capturedImage: string = "";
  professionalImageUrl: string = "";
  scientificName: string = "Unknown";
  birdFunFact = "";
  birdGenus: string = "";

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
      const birdDetails: BirdDetails = await this.birdInfoService.getBirdDetails(this.birdName);

      this.professionalImageUrl = birdDetails.imageUrl || '';
      this.birdGenus = birdDetails.genus;
      this.scientificName = birdDetails.scientificName || 'Unknown';

      console.log('Bird details loaded:', birdDetails);

    } catch (error) {
      console.error("Error fetching bird info:", error);
    }
  }

  async saveToCollection() {
    const bird: SavedBird = {
      name: this.birdName,
      scientificName: this.scientificName,
      genus: this.birdGenus,
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
}
