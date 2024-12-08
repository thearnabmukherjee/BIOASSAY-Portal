import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H10ListComponent } from './h10-list.component';

describe('H10ListComponent', () => {
  let component: H10ListComponent;
  let fixture: ComponentFixture<H10ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ H10ListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(H10ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
