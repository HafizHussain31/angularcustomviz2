import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab1chartComponent } from './tab1chart.component';

describe('Tab1chartComponent', () => {
  let component: Tab1chartComponent;
  let fixture: ComponentFixture<Tab1chartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab1chartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab1chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
