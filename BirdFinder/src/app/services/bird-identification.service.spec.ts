import { TestBed } from '@angular/core/testing';

import { BirdIdentificationService } from './bird-identification.service';

describe('BirdIdentificationService', () => {
  let service: BirdIdentificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BirdIdentificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
