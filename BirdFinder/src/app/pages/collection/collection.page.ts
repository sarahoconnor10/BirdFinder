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

  constructor(private birdCollectionService: BirdCollectionService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ionViewWillEnter() {
    await this.loadBirds();
  }

  ngOnInit() {
  }

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

  async deleteBird(birdToDelete: any) {
    try {
      // Show loading indicator
      const loading = await this.loadingController.create({
        message: 'Deleting...',
        duration: 2000
      });
      await loading.present();

      // Make sure we have the bird's ID
      if (!birdToDelete._id) {
        console.error('Cannot delete bird without ID');
        throw new Error('Bird has no ID');
      }

      // Call the service to delete from MongoDB
      await this.birdCollectionService.deleteBird(birdToDelete._id);

      // Remove from local array after successful deletion
      this.birds = this.birds.filter(bird => bird._id !== birdToDelete._id);

      // Display success message
      const toast = await this.toastController.create({
        message: 'Bird removed from collection',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

    } catch (error) {
      console.error('Error deleting bird:', error);

      // Show error message
      const toast = await this.toastController.create({
        message: 'Failed to delete bird',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }

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
