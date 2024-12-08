import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCFMAnalysisComponent } from './view-cfmanalysis.component';

describe('ViewCFMAnalysisComponent', () => {
  let component: ViewCFMAnalysisComponent;
  let fixture: ComponentFixture<ViewCFMAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCFMAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCFMAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
