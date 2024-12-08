import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TldComponent } from './tld.component';

describe('TldComponent', () => {
  let component: TldComponent;
  let fixture: ComponentFixture<TldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
