import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuclideComponent } from './nuclide.component';

describe('NuclideComponent', () => {
  let component: NuclideComponent;
  let fixture: ComponentFixture<NuclideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuclideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuclideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
