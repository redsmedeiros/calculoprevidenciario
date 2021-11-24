import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsSeguradosEditComponent } from './rgps-segurados-edit.component';

describe('RgpsSeguradosEditComponent', () => {
  let component: RgpsSeguradosEditComponent;
  let fixture: ComponentFixture<RgpsSeguradosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsSeguradosEditComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsSeguradosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
