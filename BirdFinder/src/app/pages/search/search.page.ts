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

  constructor(
    private birdSearchService: BirdSearchService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: any) {
    this.searchSubject.next(this.searchQuery);
  }

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

  viewBirdDetails(bird: any) {
    this.router.navigate(['/bird-detail'], {
      state: {
        birdName: bird.name
      }
    });
  }

  handleImageError(event: any) {
    // Replace broken images with a placeholder
    event.target.src = 'assets/placeholder.png';
  }



}
