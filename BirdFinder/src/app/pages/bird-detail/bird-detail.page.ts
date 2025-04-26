import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  date: string = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { birdName: string, capturedImage: string, date: string };

    if (state) {
      this.birdName = state.birdName;
      this.capturedImage = state.capturedImage;
      this.date = state.date;
    }
  }
  ngOnInit() {
  }

}
