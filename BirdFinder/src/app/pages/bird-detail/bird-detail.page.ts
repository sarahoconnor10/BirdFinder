import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { IonicModule } from '@ionic/angular';


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

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const state = window.history.state as {
      birdName: string,
      capturedImage?: string,
      professionalImageUrl?: string,
      date?: string,
      scientificName?: string,
      description?: string,
      funFact?: string
    };

    if (state && state.birdName) {
      this.birdName = state.birdName;
      this.capturedImage = state.capturedImage || '';
      this.professionalImageUrl = state.professionalImageUrl || '';
      this.date = state.date || '';
      this.scientificName = state.scientificName || '';
      this.description = state.description || '';
      this.birdFunFact = state.funFact || '';
    }
  }

}
