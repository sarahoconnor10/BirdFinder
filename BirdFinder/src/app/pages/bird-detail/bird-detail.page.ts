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

  constructor(private birdCollectionService: BirdCollectionService,
    private birdImageService: BirdImageService,
    private birdIdentificationService: BirdIdentificationService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

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

  async loadBirdDetails() {
    const loading = await this.loadingController.create({
      message: 'Loading bird information...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.professionalImageUrl = await this.birdImageService.getBirdImageUrl(this.birdName);

      this.birdInfo = await this.birdIdentificationService.getBirdInfoByName(this.birdName);
      console.log('Bird info loaded:', this.birdInfo);
    } catch (error) {
      console.error('Error loading bird details:', error);
    } finally {
      await loading.dismiss();
    }
  }

  async checkIfInCollection() {
    this.isInCollection = await this.birdCollectionService.hasBirdInCollection(this.birdName);
  }

}
