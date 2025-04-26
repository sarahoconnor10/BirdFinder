import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ProfilePage implements OnInit {
  userName = 'Guest User';
  darkModeEnabled = false;
  notificationsEnabled = true;

  constructor() { }

  ngOnInit() {
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.darkModeEnabled);
  }

}
