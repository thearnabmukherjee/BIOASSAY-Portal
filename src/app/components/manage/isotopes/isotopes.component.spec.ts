import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsotopesComponent } from './isotopes.component';

describe('IsotopesComponent', () => {
  let component: IsotopesComponent;
  let fixture: ComponentFixture<IsotopesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsotopesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsotopesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
