import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggle5chartComponent } from './toggle5chart.component';

describe('Toggle5chartComponent', () => {
  let component: Toggle5chartComponent;
  let fixture: ComponentFixture<Toggle5chartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Toggle5chartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Toggle5chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
