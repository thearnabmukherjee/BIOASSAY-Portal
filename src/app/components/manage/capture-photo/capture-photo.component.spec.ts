import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturePhotoComponent } from './capture-photo.component';

describe('CapturePhotoComponent', () => {
  let component: CapturePhotoComponent;
  let fixture: ComponentFixture<CapturePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapturePhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
