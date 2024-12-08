import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMonitoringDetailsComponent } from './view-monitoring-details.component';

describe('ViewMonitoringDetailsComponent', () => {
  let component: ViewMonitoringDetailsComponent;
  let fixture: ComponentFixture<ViewMonitoringDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMonitoringDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMonitoringDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
