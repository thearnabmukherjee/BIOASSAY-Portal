import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlphaAnalysisComponent } from './view-alpha-analysis.component';

describe('ViewAlphaAnalysisComponent', () => {
  let component: ViewAlphaAnalysisComponent;
  let fixture: ComponentFixture<ViewAlphaAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAlphaAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAlphaAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
