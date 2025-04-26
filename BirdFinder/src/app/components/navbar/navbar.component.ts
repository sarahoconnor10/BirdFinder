import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bookmark, person, camera, search, home } from 'ionicons/icons';
import { Router } from '@angular/router';
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

  constructor(private router: Router) { }

  ngOnInit() { }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

}
