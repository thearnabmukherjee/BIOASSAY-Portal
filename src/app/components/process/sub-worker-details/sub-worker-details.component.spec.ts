import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubWorkerDetailsComponent } from './sub-worker-details.component';

describe('SubWorkerDetailsComponent', () => {
  let component: SubWorkerDetailsComponent;
  let fixture: ComponentFixture<SubWorkerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubWorkerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubWorkerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
