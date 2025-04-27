/**
 * Navbar Component
 * This is a custom navigation bar component used throughout the BirdFinder app
 * to provide consistent navigation between the main sections of the application.
 */

import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bookmark, person, camera, search, home } from 'ionicons/icons';
import { Router } from '@angular/router';

// Register Ionic icons for use throughout the navbar
addIcons({
  "home": home,
  "camera": camera,
  "search": search,
  "bookmark": bookmark,
  "person": person
});

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonicModule]
})
export class NavbarComponent implements OnInit {
  /**
     * Constructor for the NavbarComponent
     * @param router Angular Router service for navigation between pages
     */
  constructor(private router: Router) { }

  ngOnInit() { }
  /**
     * Navigates to the specified page in the application
     * @param page The route name to navigate to 
     */
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
