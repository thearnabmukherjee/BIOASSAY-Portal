import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnalysisComponent } from './create-analysis.component';

describe('CreateAnalysisComponent', () => {
  let component: CreateAnalysisComponent;
  let fixture: ComponentFixture<CreateAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
