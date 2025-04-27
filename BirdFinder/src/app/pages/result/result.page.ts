import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BirdCollectionService } from 'src/app/services/bird-collection.service';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

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
    private toastController: ToastController) {

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { birdInfo: any, capturedImage: string };

    if (state && state.birdInfo) {
      this.birdInfo = state.birdInfo;
      this.capturedImage = state.capturedImage;
    }
  }

  async saveToCollection() {
    const bird: SavedBird = {
      name: this.birdInfo.commonName,
      scientificName: this.birdInfo.scientificName,
      habitat: this.birdInfo.habitat,
      rarity: this.birdInfo.rarity,
      funFact: this.birdInfo.funFact,
      description: this.birdInfo.shortDescription,
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
