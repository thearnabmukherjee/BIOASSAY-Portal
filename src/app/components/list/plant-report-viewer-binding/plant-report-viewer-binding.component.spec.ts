import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantReportViewerBindingComponent } from './plant-report-viewer-binding.component';

describe('PlantReportViewerBindingComponent', () => {
  let component: PlantReportViewerBindingComponent;
  let fixture: ComponentFixture<PlantReportViewerBindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantReportViewerBindingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantReportViewerBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
