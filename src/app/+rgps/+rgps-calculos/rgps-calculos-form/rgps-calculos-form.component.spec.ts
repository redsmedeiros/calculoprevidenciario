import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsCalculosFormComponent } from './rgps-calculos-form.component';

describe('RgpsCalculosFormComponent', () => {
  let component: RgpsCalculosFormComponent;
  let fixture: ComponentFixture<RgpsCalculosFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsCalculosFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsCalculosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
