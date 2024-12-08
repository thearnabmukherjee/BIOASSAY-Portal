import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectorsComponent } from './detectors.component';

describe('DetectorsComponent', () => {
  let component: DetectorsComponent;
  let fixture: ComponentFixture<DetectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
