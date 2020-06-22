import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab2chartComponent } from './tab2chart.component';

describe('Tab2chartComponent', () => {
  let component: Tab2chartComponent;
  let fixture: ComponentFixture<Tab2chartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab2chartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab2chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
