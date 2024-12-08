import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTypeComponent } from './process-type.component';

describe('ProcessTypeComponent', () => {
  let component: ProcessTypeComponent;
  let fixture: ComponentFixture<ProcessTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
