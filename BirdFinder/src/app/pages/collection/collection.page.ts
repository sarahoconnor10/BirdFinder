import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonBackButton, IonList, IonThumbnail, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { BirdCollectionService } from 'src/app/services/bird-collection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonBackButton, IonList, IonThumbnail, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption]
})

export class CollectionPage implements OnInit {
  birds: any[] = [];

  constructor(private birdCollectionService: BirdCollectionService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.loadBirds();
  }

  ngOnInit() {
  }

  loadBirds() {
    this.birds = this.birdCollectionService.getSavedBirds();
    console.log('Loaded birds:', this.birds);
  }

  deleteBird(birdToDelete: any) {
    this.birds = this.birds.filter(bird => bird !== birdToDelete);
    this.birdCollectionService.saveAllBirds(this.birds);
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
