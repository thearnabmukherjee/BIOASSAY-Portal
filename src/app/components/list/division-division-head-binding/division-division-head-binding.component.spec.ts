import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionDivisionHeadBindingComponent } from './division-division-head-binding.component';

describe('DivisionDivisionHeadBindingComponent', () => {
  let component: DivisionDivisionHeadBindingComponent;
  let fixture: ComponentFixture<DivisionDivisionHeadBindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionDivisionHeadBindingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionDivisionHeadBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
