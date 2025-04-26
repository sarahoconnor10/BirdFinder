import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonBackButton, IonList, IonItem, IonThumbnail, IonLabel } from '@ionic/angular/standalone';
import { RouterLinkWithHref } from '@angular/router';
import { BirdCollectionService } from '../services/bird-collection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, RouterLinkWithHref, IonBackButton, IonList, IonItem, IonThumbnail, IonLabel],
})
export class HomePage {
  recentBirds: any[] = [];

  constructor(private birdCollectionService: BirdCollectionService) { }

  ionViewWillEnter() {
    this.loadRecentBirds();
  }

  loadRecentBirds() {
    const allBirds = this.birdCollectionService.getSavedBirds();
    this.recentBirds = allBirds.reverse().slice(0, 5);
  }

}
