import { TestBed } from '@angular/core/testing';

import { BirdSearchService } from './bird-search.service';

describe('BirdSearchService', () => {
  let service: BirdSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BirdSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
