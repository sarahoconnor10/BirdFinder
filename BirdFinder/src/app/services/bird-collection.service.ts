import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BirdCollectionService {
  private STORAGE_KEY = 'savedBirds';

  constructor() { }

  getSavedBirds(): any[] {
    const birds = localStorage.getItem(this.STORAGE_KEY);
    return birds ? JSON.parse(birds) : [];
  }

  saveBird(bird: any): void {
    const birds = this.getSavedBirds();
    birds.push(bird);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(birds));
  }

  saveAllBirds(birds: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(birds));
  }
}
