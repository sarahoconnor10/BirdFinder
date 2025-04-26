import { TestBed } from '@angular/core/testing';

import { BirdInfoService } from './bird-info.service';

describe('BirdInfoService', () => {
  let service: BirdInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BirdInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
