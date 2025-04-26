import { TestBed } from '@angular/core/testing';

import { BirdCollectionService } from './bird-collection.service';

describe('BirdCollectionService', () => {
  let service: BirdCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BirdCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
