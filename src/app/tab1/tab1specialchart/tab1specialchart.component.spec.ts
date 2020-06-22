import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab1specialchartComponent } from './tab1specialchart.component';

describe('Tab1specialchartComponent', () => {
  let component: Tab1specialchartComponent;
  let fixture: ComponentFixture<Tab1specialchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab1specialchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab1specialchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
