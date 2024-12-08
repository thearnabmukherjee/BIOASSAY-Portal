import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantHPBindingComponent } from './plant-hpbinding.component';

describe('PlantHPBindingComponent', () => {
  let component: PlantHPBindingComponent;
  let fixture: ComponentFixture<PlantHPBindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantHPBindingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantHPBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
