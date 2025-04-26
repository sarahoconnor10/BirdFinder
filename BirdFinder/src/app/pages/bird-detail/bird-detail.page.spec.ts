import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirdDetailPage } from './bird-detail.page';

describe('BirdDetailPage', () => {
  let component: BirdDetailPage;
  let fixture: ComponentFixture<BirdDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
