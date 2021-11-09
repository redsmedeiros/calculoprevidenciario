import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoSeguradosComponent } from './rgps-planejamento-segurados.component';

describe('RgpsPlanejamentoSeguradosComponent', () => {
  let component: RgpsPlanejamentoSeguradosComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoSeguradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoSeguradosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoSeguradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
