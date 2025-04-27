/**
* Search Page Component
* 
* This page allows users to search for birds by name.
* It implements a debounced search that triggers after the user stops typing,
* providing a smooth user experience without excessive API calls.
*/

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { IonicModule } from '@ionic/angular';
import { BirdSearchService } from 'src/app/services/bird-search.service';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, NavbarComponent]
})
export class SearchPage implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;
  searchPerformed: boolean = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  /**
  * Constructor for SearchPage
  * 
  * @param birdSearchService Service to search for birds
  * @param router Angular Router for navigation
  */
  constructor(
    private birdSearchService: BirdSearchService,
    private router: Router
  ) { }

  /**
  * Angular lifecycle hook that runs after component initialization
  * Sets up the debounced search functionality
  */
  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  /**
  * Angular lifecycle hook that runs when component is about to be destroyed
  * Cleans up subscriptions to prevent memory leaks
  */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
  * Triggered when user types in the search input
  * Passes the current search query to the debounced subject
  * 
  * @param event Input change event
  */
  onSearchChange(event: any) {
    this.searchSubject.next(this.searchQuery);
  }

  /**
  * Performs the search operation after debounce delay
  * 
  * @param query The search string to look for
  */
  async performSearch(query: string) {
    if (!query || query.trim().length < 2) {
      this.searchResults = [];
      this.searchPerformed = false;
      return;
    }

    this.isLoading = true;
    this.searchPerformed = true;

    try {
      this.searchResults = await this.birdSearchService.searchBirds(query);
    } catch (error) {
      console.error('Error during search:', error);
      this.searchResults = [];
    } finally {
      this.isLoading = false;
    }
  }

  /**
  * Navigates to the bird detail page for the selected bird
  * 
  * @param bird The bird object to view details for
  */
  viewBirdDetails(bird: any) {
    this.router.navigate(['/bird-detail'], {
      state: {
        birdName: bird.name
      }
    });
  }

  /**
   * Handles image loading errors by replacing with a placeholder
   * 
   * @param event The error event from the image element
   */
  handleImageError(event: any) {
    event.target.src = 'assets/placeholder.png';
  }
}
