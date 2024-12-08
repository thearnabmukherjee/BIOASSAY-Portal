import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSAMAnalysisComponent } from './view-samanalysis.component';

describe('ViewSAMAnalysisComponent', () => {
  let component: ViewSAMAnalysisComponent;
  let fixture: ComponentFixture<ViewSAMAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSAMAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSAMAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
