/**
* Bird Detail Page Component
* 
* Displays detailed information about a specific bird species.
* This page shows both user-captured images (if bird has been spotted), and professional 
* images, along with detailed information about the bird species.
*/

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { IonicModule } from '@ionic/angular';
import { BirdImageService } from 'src/app/services/bird-image.service';
import { BirdIdentificationService } from 'src/app/services/bird-identification.service';
import { LoadingController } from '@ionic/angular';
import { BirdCollectionService } from 'src/app/services/bird-collection.service';
import { addIcons } from 'ionicons';
import { checkmarkCircle, removeCircle } from 'ionicons/icons';

addIcons({
  'checkmark-circle': checkmarkCircle,
  'remove-circle': removeCircle,
});

@Component({
  selector: 'app-bird-detail',
  templateUrl: './bird-detail.page.html',
  styleUrls: ['./bird-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent]
})
export class BirdDetailPage implements OnInit {
  birdName: string = '';
  capturedImage: string = '';
  professionalImageUrl: any = '';
  date: string = '';
  birdInfo: any = {};
  isLoading: boolean = false;
  isInCollection: boolean = false;

  /**
   * Constructor for BirdDetailPage
   * 
   * @param birdCollectionService Service to check if bird is in user's collection
   * @param birdImageService Service to retrieve professional bird images
   * @param birdIdentificationService Service to get detailed bird information
   * @param loadingController Ionic loading controller for loading indicators
   */
  constructor(
    private birdCollectionService: BirdCollectionService,
    private birdImageService: BirdImageService,
    private birdIdentificationService: BirdIdentificationService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() { }

  /**
    * Ionic lifecycle hook that runs when the page is about to enter
    * Retrieves bird information passed through router state
    */
  async ionViewWillEnter() {
    const state = window.history.state as {
      birdName: string,
      capturedImage?: string,
      date?: string
    };

    if (state && state.birdName) {
      this.birdName = state.birdName;
      this.capturedImage = state.capturedImage || '';
      this.date = state.date || '';

      await this.loadBirdDetails();
      await this.checkIfInCollection();
    }
  }

  /**
  * Loads detailed information about the bird from external services
  * Displays a loading indicator during the process
  */
  async loadBirdDetails() {
    const loading = await this.loadingController.create({
      message: 'Loading bird information...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.professionalImageUrl = await this.birdImageService.getBirdImageUrl(this.birdName);
      this.birdInfo = await this.birdIdentificationService.getBirdInfoByName(this.birdName);
    } catch (error) {
      console.error('Error loading bird details:', error);
    } finally {
      await loading.dismiss();
    }
  }

  /**
  * Checks if this bird species is already in the user's collection
  */
  async checkIfInCollection() {
    this.isInCollection = await this.birdCollectionService.hasBirdInCollection(this.birdName);
  }
}
