import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLFAnalysisComponent } from './view-lfanalysis.component';

describe('ViewLFAnalysisComponent', () => {
  let component: ViewLFAnalysisComponent;
  let fixture: ComponentFixture<ViewLFAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLFAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLFAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
