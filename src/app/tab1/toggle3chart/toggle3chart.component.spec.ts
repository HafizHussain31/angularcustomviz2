import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggle3chartComponent } from './toggle3chart.component';

describe('Toggle3chartComponent', () => {
  let component: Toggle3chartComponent;
  let fixture: ComponentFixture<Toggle3chartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Toggle3chartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Toggle3chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
