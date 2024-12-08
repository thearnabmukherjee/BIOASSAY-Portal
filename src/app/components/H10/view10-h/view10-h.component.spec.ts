import { ComponentFixture, TestBed } from '@angular/core/testing';

import { View10HComponent } from './view10-h.component';

describe('View10HComponent', () => {
  let component: View10HComponent;
  let fixture: ComponentFixture<View10HComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ View10HComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(View10HComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
