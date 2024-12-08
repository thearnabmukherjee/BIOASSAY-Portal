import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubListMonitoringsComponent } from './sub-list-monitorings.component';

describe('SubListMonitoringsComponent', () => {
  let component: SubListMonitoringsComponent;
  let fixture: ComponentFixture<SubListMonitoringsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubListMonitoringsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubListMonitoringsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
