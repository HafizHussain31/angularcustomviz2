import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggle2chartComponent } from './toggle2chart.component';

describe('Toggle2chartComponent', () => {
  let component: Toggle2chartComponent;
  let fixture: ComponentFixture<Toggle2chartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Toggle2chartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Toggle2chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
