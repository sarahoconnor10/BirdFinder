import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { IonicModule } from '@ionic/angular';
import { BirdInfoService } from 'src/app/services/bird-info.service';

@Component({
  selector: 'app-bird-detail',
  templateUrl: './bird-detail.page.html',
  styleUrls: ['./bird-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref, NavbarComponent]
})
export class BirdDetailPage implements OnInit {
  birdName: string = '';
  capturedImage: string = '';
  professionalImageUrl: string = '';
  date: string = '';
  scientificName: string = '';
  description: string = '';
  birdFunFact: string = '';
  familyName: string = '';
  genusName: string = '';

  constructor(private birdInfoService: BirdInfoService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const state = window.history.state as { birdName: string };

    if (state && state.birdName) {
      this.birdName = state.birdName;
      this.loadBirdInfo();
      //this.loadBirdFunFact();
    }
  }

  async loadBirdInfo() {
    try {
      const info = await this.birdInfoService.getBirdInfoINat(this.birdName);

      this.professionalImageUrl = info.imageUrl;
      this.description = info.wikiUrl;
      this.scientificName = info.scientificName;
      this.familyName = info.family;
      this.genusName = info.genus;
    } catch (error) {
      console.error('Error fetching bird info:', error);
      this.description = 'Could not find information about this bird.';
    }
  }

}
