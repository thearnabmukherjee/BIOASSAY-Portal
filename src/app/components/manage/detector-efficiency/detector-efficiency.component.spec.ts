import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectorEfficiencyComponent } from './detector-efficiency.component';

describe('DetectorEfficiencyComponent', () => {
  let component: DetectorEfficiencyComponent;
  let fixture: ComponentFixture<DetectorEfficiencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectorEfficiencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectorEfficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
