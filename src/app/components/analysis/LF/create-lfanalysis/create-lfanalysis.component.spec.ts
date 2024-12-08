import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLFAnalysisComponent } from './create-lfanalysis.component';

describe('CreateLFAnalysisComponent', () => {
  let component: CreateLFAnalysisComponent;
  let fixture: ComponentFixture<CreateLFAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLFAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLFAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
