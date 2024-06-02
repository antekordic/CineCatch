import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingControlComponent } from './rating-control.component';

describe('RatingControlComponent', () => {
  let component: RatingControlComponent;
  let fixture: ComponentFixture<RatingControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatingControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
