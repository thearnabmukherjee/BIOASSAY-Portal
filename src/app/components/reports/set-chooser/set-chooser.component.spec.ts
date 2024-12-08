import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetChooserComponent } from './set-chooser.component';

describe('SetChooserComponent', () => {
  let component: SetChooserComponent;
  let fixture: ComponentFixture<SetChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetChooserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
