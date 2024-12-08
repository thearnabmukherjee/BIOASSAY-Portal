import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptMonitoringDetailsComponent } from './accept-monitoring-details.component';

describe('AcceptMonitoringDetailsComponent', () => {
  let component: AcceptMonitoringDetailsComponent;
  let fixture: ComponentFixture<AcceptMonitoringDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptMonitoringDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptMonitoringDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
