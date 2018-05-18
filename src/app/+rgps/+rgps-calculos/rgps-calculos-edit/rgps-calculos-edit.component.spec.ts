import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsCalculosEditComponent } from './rgps-calculos-edit.component';

describe('RgpsCalculosEditComponent', () => {
  let component: RgpsCalculosEditComponent;
  let fixture: ComponentFixture<RgpsCalculosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsCalculosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsCalculosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
