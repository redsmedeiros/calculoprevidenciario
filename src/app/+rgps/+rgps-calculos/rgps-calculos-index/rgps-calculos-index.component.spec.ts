import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsCalculosIndexComponent } from './rgps-calculos-index.component';

describe('RgpsCalculosIndexComponent', () => {
  let component: RgpsCalculosIndexComponent;
  let fixture: ComponentFixture<RgpsCalculosIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsCalculosIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsCalculosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
