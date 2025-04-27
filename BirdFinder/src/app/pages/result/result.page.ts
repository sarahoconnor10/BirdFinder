import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BirdCollectionService } from 'src/app/services/bird-collection.service';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { StorageService } from 'src/app/services/storage.service';

interface SavedBird {
  name: string;
  scientificName: string;
  habitat: string;
  rarity: string;
  funFact: string;
  description: string;
  image: string;
  date: string;
}

/**
 * commonName: The common name of the bird.
            - scientificName: The scientific (Latin) name.
            - habitat: The typical habitat of this bird.
            - rarity: One of Common, Uncommon, Rare.
            - funFact: One interesting real fact about the bird.
            - shortDescription:
 */

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, NavbarComponent]
})

export class ResultPage {
  birdInfo: any = {};
  capturedImage: string = '';
  professionalImageUrl: string = '';

  constructor(private router: Router,
    private birdCollectionService: BirdCollectionService,
    private toastController: ToastController,
    private storageService: StorageService) { }

  ionViewWillEnter() {
    const state = window.history.state as { birdInfo: any, capturedImage: string };

    if (state && state.birdInfo) {
      this.birdInfo = state.birdInfo;
      this.capturedImage = state.capturedImage;
    } else {
      console.error('No navigation state found');
    }
  }

  async saveToCollection() {
    try {
      let imageUrl = '';

      if (this.capturedImage) {
        console.log('Captured image exists, uploading to Firebase...');
        imageUrl = await this.storageService.uploadImage(this.capturedImage);
        console.log('Image uploaded, URL:', imageUrl);
      } else {
        console.log('No captured image to upload');
      }

      const bird: SavedBird = {
        name: this.birdInfo.commonName,
        scientificName: this.birdInfo.scientificName,
        habitat: this.birdInfo.habitat,
        rarity: this.birdInfo.rarity,
        funFact: this.birdInfo.funFact,
        description: this.birdInfo.shortDescription,
        image: imageUrl,
        date: new Date().toISOString()
      };

      console.log('Saving bird with data:', bird);
      await this.birdCollectionService.saveBird(bird);


      const toast = await this.toastController.create({
        message: 'Bird saved to collection!',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });

      await toast.present();
    } catch (error) {
      console.error('Error saving bird:', error);
      const toast = await this.toastController.create({
        message: 'Error saving bird to collection',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }
}
