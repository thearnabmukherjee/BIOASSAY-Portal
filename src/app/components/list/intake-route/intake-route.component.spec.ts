import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeRouteComponent } from './intake-route.component';

describe('IntakeRouteComponent', () => {
  let component: IntakeRouteComponent;
  let fixture: ComponentFixture<IntakeRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakeRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
