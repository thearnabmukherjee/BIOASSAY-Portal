import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSourceComponent } from './check-source.component';

describe('CheckSourceComponent', () => {
  let component: CheckSourceComponent;
  let fixture: ComponentFixture<CheckSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
