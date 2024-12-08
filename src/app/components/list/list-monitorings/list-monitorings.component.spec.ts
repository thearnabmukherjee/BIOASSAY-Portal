import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMonitoringsComponent } from './list-monitorings.component';

describe('ListMonitoringsComponent', () => {
  let component: ListMonitoringsComponent;
  let fixture: ComponentFixture<ListMonitoringsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMonitoringsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMonitoringsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
