import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBunchComponent } from './create-bunch.component';

describe('CreateBunchComponent', () => {
  let component: CreateBunchComponent;
  let fixture: ComponentFixture<CreateBunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBunchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
