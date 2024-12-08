import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Create10HComponent } from './create10-h.component';

describe('Create10HComponent', () => {
  let component: Create10HComponent;
  let fixture: ComponentFixture<Create10HComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Create10HComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Create10HComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
