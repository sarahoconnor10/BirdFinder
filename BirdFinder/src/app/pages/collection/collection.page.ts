/**
* Collection Page Component
* 
* This page displays all birds the user has saved to their collection.
* Users can view details of each bird or delete birds from their collection.
* The data is stored in MongoDB and Firebase storage, and retrieved via the 
* BirdCollectionService.
*/

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BirdCollectionService } from 'src/app/services/bird-collection.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NavbarComponent]
})
export class CollectionPage implements OnInit {
  birds: any[] = [];

  /**
  * Constructor for CollectionPage
  * 
  * @param birdCollectionService Service to access saved bird data in MongoDB
  * @param router Angular Router for navigation
  * @param loadingController Ionic loading controller for loading indicators
  * @param toastController Ionic toast controller for notifications
  */
  constructor(
    private birdCollectionService: BirdCollectionService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  /**
  * Ionic lifecycle hook that runs when the page is about to enter
  * Asynchronously loads the user's bird collection
  */
  async ionViewWillEnter() {
    await this.loadBirds();
  }

  ngOnInit() {
  }

  /**
  * Fetches all saved birds from the database and prepares them for display
  */
  async loadBirds() {
    try {
      const birds = await this.birdCollectionService.getSavedBirds();
      console.log('Loaded birds from MongoDB:', birds);

      this.birds = birds.map(bird => ({
        ...bird,
        image: bird.image || ''
      }));

      console.log('Processed birds for display:', this.birds);
    } catch (error) {
      console.error('Error loading birds:', error);
      this.birds = [];
    }
  }

  /**
   * Deletes a bird from the user's collection
   * Shows loading indicator and confirmation toast
   * 
   * @param birdToDelete The bird object to be deleted
   */
  async deleteBird(birdToDelete: any) {
    try {
      const loading = await this.loadingController.create({
        message: 'Deleting...',
        duration: 2000
      });
      await loading.present();

      if (!birdToDelete._id) {
        console.error('Cannot delete bird without ID');
        throw new Error('Bird has no ID');
      }

      await this.birdCollectionService.deleteBird(birdToDelete._id);

      this.birds = this.birds.filter(bird => bird._id !== birdToDelete._id);

      const toast = await this.toastController.create({
        message: 'Bird removed from collection',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

    } catch (error) {
      console.error('Error deleting bird:', error);

      const toast = await this.toastController.create({
        message: 'Failed to delete bird',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  /**
  * Navigates to the bird detail page for the selected bird
  * 
  * @param bird The bird object to view details for
  */
  viewBirdDetails(bird: any) {
    this.router.navigate(['/bird-detail'], {
      state: {
        birdName: bird.name,
        capturedImage: bird.image,
        date: bird.date
      }
    });
  }
}
