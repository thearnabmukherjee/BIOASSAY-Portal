import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonDetailsComponent } from './mon-details.component';

describe('MonDetailsComponent', () => {
  let component: MonDetailsComponent;
  let fixture: ComponentFixture<MonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
