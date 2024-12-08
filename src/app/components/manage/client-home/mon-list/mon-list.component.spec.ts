import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonListComponent } from './mon-list.component';

describe('MonListComponent', () => {
  let component: MonListComponent;
  let fixture: ComponentFixture<MonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
