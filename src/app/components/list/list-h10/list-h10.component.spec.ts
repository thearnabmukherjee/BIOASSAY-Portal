import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListH10Component } from './list-h10.component';

describe('ListH10Component', () => {
  let component: ListH10Component;
  let fixture: ComponentFixture<ListH10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListH10Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListH10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
