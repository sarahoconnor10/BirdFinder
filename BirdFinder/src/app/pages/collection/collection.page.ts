import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonBackButton, IonList, IonThumbnail, IonItem, IonLabel } from '@ionic/angular/standalone';
import { BirdCollectionService } from 'src/app/services/bird-collection.service';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonBackButton, IonList, IonThumbnail, IonItem, IonLabel]
})
export class CollectionPage implements OnInit {
  birds: any[] = [];

  constructor(private birdCollectionService: BirdCollectionService) { }

  ionViewWillEnter() {
    this.loadBirds();
  }

  ngOnInit() {
  }

  loadBirds() {
    this.birds = this.birdCollectionService.getSavedBirds();
    console.log('Loaded birds:', this.birds);
  }

}
