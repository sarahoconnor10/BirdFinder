/**
* Home Page Component
* 
* This is the main landing page of the BirdFinder app that displays:
* 1. Recently spotted birds from the user's collection
* 2. Local bird species based on the user's current location
*/

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

  /**
    * Constructor for HomePage
    * 
    * @param birdCollectionService Service to access saved bird data
    * @param ebirdService Service to fetch local bird data from eBird API
    * @param birdImageService Service to retrieve bird images
    * @param router Angular Router for navigation
    */
  constructor(private birdCollectionService: BirdCollectionService,
    private ebirdService: EbirdService,
    private birdImageService: BirdImageService,
    private router: Router
  ) { }

  /**
  * Ionic lifecycle hook that runs when the page is about to enter
  * Loads both the user's recent bird sightings and local species data
  */
  async ionViewWillEnter() {
    await this.loadRecentBirds();
    this.loadLocalSpecies();
  }

  /**
  * Fetches the user's saved birds and displays the 5 most recent entries
  */
  async loadRecentBirds() {
    const allBirds = await this.birdCollectionService.getSavedBirds();
    this.recentBirds = allBirds.reverse().slice(0, 5);
  }

  /**
  * Gets the user's current geolocation and loads local bird species
  */
  async loadLocalSpecies() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();

      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;


      await this.fetchLocalBirds(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      this.localSpecies = [];
    }
  }

  /**
  * Fetches birds in the area using the eBird API and adds images
  * 
  * @param lat Latitude coordinate
  * @param lon Longitude coordinate
  */
  async fetchLocalBirds(lat: number, lon: number) {
    try {
      const birds = await this.ebirdService.getNearbyBirds(lat, lon);
      console.log('Nearby birds:', birds);

      const birdPromises = birds.map(async (bird) => {
        try {
          let imageUrl = await this.birdImageService.getBirdImageUrl(bird.comName);

          if (!imageUrl) {
            const simplifiedName = bird.comName
              .replace(/\(.*?\)/g, '')
              .split(' ')[0]
              .trim();

            imageUrl = await this.birdImageService.getBirdImageUrl(simplifiedName);
          }

          return {
            name: bird.comName,
            scientificName: bird.sciName,
            dateObserved: bird.obsDt,
            image: imageUrl || 'assets/placeholder.png'
          };
        } catch (error) {
          console.error(`Error getting image for ${bird.comName}:`, error);
          return {
            name: bird.comName,
            scientificName: bird.sciName,
            dateObserved: bird.obsDt,
            image: 'assets/placeholder.png'
          };
        }
      });

      const results = await Promise.allSettled(birdPromises);

      this.localSpecies = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value);

    } catch (error) {
      console.error('Error fetching local birds:', error);
      this.localSpecies = [];
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
        birdName: bird.name
      }
    });
  }

  /**
  * Handles image loading errors by replacing with a placeholder
  * 
  * @param event The error event from the image element
  */
  handleImageError(event: any) {
    event.target.src = 'assets/placeholder.png';
  }
}
