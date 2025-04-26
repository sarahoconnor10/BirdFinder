import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonBackButton, IonList, IonItem, IonThumbnail, IonLabel } from '@ionic/angular/standalone';
import { RouterLinkWithHref } from '@angular/router';
import { BirdCollectionService } from '../services/bird-collection.service';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { EbirdService } from '../services/ebird.service';
import { BirdImageService } from '../services/bird-image.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, RouterLinkWithHref, IonBackButton, IonList, IonItem, IonThumbnail, IonLabel],
})
export class HomePage {
  recentBirds: any[] = [];
  localSpecies: any[] = [];


  constructor(private birdCollectionService: BirdCollectionService,
    private ebirdService: EbirdService,
    private birdImageService: BirdImageService
  ) { }

  ionViewWillEnter() {
    this.loadRecentBirds();
    this.loadLocalSpecies();
  }

  loadRecentBirds() {
    const allBirds = this.birdCollectionService.getSavedBirds();
    this.recentBirds = allBirds.reverse().slice(0, 5);
  }

  async loadLocalSpecies() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates);

      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;

      console.log(`User is at lat: ${latitude}, lng: ${longitude}`);

      await this.fetchLocalBirds(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      this.localSpecies = [];
    }
  }

  async fetchLocalBirds(lat: number, lon: number) {
    try {
      const birds = await this.ebirdService.getNearbyBirds(lat, lon);
      console.log('Nearby birds:', birds);

      const birdPromises = birds.map(async (bird) => {
        const imageUrl = await this.birdImageService.getBirdImageUrl(bird.comName);

        return {
          name: bird.comName,
          scientificName: bird.sciName,
          dateObserved: bird.obsDt,
          image: imageUrl
        };
      });

      this.localSpecies = await Promise.all(birdPromises);

      console.log('Local species with images:', this.localSpecies);
    } catch (error) {
      console.error('Error fetching local birds:', error);
      this.localSpecies = [];
    }
  }



}
