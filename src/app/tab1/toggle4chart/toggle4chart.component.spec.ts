import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggle4chartComponent } from './toggle4chart.component';

describe('Toggle4chartComponent', () => {
  let component: Toggle4chartComponent;
  let fixture: ComponentFixture<Toggle4chartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Toggle4chartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Toggle4chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
