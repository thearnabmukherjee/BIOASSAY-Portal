import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAlphaAnalysisComponent } from './create-alpha-analysis.component';

describe('CreateAlphaAnalysisComponent', () => {
  let component: CreateAlphaAnalysisComponent;
  let fixture: ComponentFixture<CreateAlphaAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAlphaAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAlphaAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
