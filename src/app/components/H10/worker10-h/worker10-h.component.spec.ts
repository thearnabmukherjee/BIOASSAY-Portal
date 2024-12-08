import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Worker10HComponent } from './worker10-h.component';

describe('Worker10HComponent', () => {
  let component: Worker10HComponent;
  let fixture: ComponentFixture<Worker10HComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Worker10HComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Worker10HComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
