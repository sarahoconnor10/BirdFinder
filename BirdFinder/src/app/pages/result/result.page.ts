/**
* Result Page Component
* 
* This page displays the bird identification results and allows the user
* to save the identified bird to their collection. The page receives bird
* information and the captured image from the camera page.
*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BirdCollectionService } from 'src/app/services/bird-collection.service';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { StorageService } from 'src/app/services/storage.service';

/**
* Interface defining the structure of a bird record to be saved to the database
*/
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
  isSaving: boolean = false;

  /**
  * Constructor for ResultPage
  * 
  * @param router Angular Router for navigation
  * @param birdCollectionService Service to save birds to MongoDB
  * @param toastController Ionic toast controller for notifications
  * @param storageService Service to upload images to Firebase storage
  */
  constructor(
    private router: Router,
    private birdCollectionService: BirdCollectionService,
    private toastController: ToastController,
    private storageService: StorageService
  ) { }

  /**
  * Ionic lifecycle hook that runs when the page is about to enter
  * Retrieves bird information passed through router state
  */
  ionViewWillEnter() {
    const state = window.history.state as { birdInfo: any, capturedImage: string };

    if (state && state.birdInfo) {
      this.birdInfo = state.birdInfo;
      this.capturedImage = state.capturedImage;
    } else {
      console.error('No navigation state found');
    }
  }

  /**
    * Saves the identified bird to the user's collection
    * 1. Uploads the image to Firebase Storage
    * 2. Saves the bird data to MongoDB
    * 3. Shows confirmation and navigates to collection page
    */
  async saveToCollection() {
    this.isSaving = true;

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
        position: 'top'
      });

      await toast.present();

      setTimeout(() => {
        this.router.navigate(['/collection']);
      }, 1500);

    } catch (error) {
      console.error('Error saving bird:', error);
      const toast = await this.toastController.create({
        message: 'Error saving bird to collection',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    } finally {
      this.isSaving = false;
    }
  }
}
