import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsResultadosAposPec103Component } from './rgps-resultados-apos-pec103.component';

describe('RgpsResultadosAposPec103Component', () => {
  let component: RgpsResultadosAposPec103Component;
  let fixture: ComponentFixture<RgpsResultadosAposPec103Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsResultadosAposPec103Component ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsResultadosAposPec103Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
