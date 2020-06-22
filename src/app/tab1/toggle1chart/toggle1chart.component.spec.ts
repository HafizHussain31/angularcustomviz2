import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggle1chartComponent } from './toggle1chart.component';

describe('Toggle1chartComponent', () => {
  let component: Toggle1chartComponent;
  let fixture: ComponentFixture<Toggle1chartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Toggle1chartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Toggle1chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
