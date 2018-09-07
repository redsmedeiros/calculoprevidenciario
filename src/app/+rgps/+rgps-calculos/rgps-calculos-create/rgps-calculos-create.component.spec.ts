import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsCalculosCreateComponent } from './rgps-calculos-create.component';

describe('RgpsCalculosCreateComponent', () => {
  let component: RgpsCalculosCreateComponent;
  let fixture: ComponentFixture<RgpsCalculosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsCalculosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsCalculosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
