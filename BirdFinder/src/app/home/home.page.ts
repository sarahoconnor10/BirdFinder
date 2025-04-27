import { Component } from '@angular/core';
import { BirdCollectionService } from '../services/bird-collection.service';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { EbirdService } from '../services/ebird.service';
import { BirdImageService } from '../services/bird-image.service';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, NavbarComponent],
})
export class HomePage {
  recentBirds: any[] = [];
  localSpecies: any[] = [];


  constructor(private birdCollectionService: BirdCollectionService,
    private ebirdService: EbirdService,
    private birdImageService: BirdImageService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    await this.loadRecentBirds();
    this.loadLocalSpecies();
  }

  async loadRecentBirds() {
    const allBirds = await this.birdCollectionService.getSavedBirds();
    this.recentBirds = allBirds.reverse().slice(0, 5);
  }

  async loadLocalSpecies() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      //console.log('Current position:', coordinates);

      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;

      //console.log(`User is at lat: ${latitude}, lng: ${longitude}`);

      await this.fetchLocalBirds(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      this.localSpecies = [];
    }
  }

  async fetchLocalBirds(lat: number, lon: number) {
    try {
      const birds = await this.ebirdService.getNearbyBirds(lat, lon);
      // console.log('Nearby birds:', birds);

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

      // console.log('Local species with images:', this.localSpecies);
    } catch (error) {
      console.error('Error fetching local birds:', error);
      this.localSpecies = [];
    }
  }

  viewBirdDetails(bird: any) {
    this.router.navigate(['/bird-detail'], {
      state: {
        birdName: bird.name
      }
    });
  }




}
