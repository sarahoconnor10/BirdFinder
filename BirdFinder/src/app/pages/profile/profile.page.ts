import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, NavbarComponent]
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
