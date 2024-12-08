import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Edit10HComponent } from './edit10-h.component';

describe('Edit10HComponent', () => {
  let component: Edit10HComponent;
  let fixture: ComponentFixture<Edit10HComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Edit10HComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Edit10HComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
