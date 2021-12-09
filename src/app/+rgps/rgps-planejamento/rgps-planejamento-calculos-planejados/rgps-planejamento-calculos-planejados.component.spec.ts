import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoCalculosPlanejadosComponent } from './rgps-planejamento-calculos-planejados.component';

describe('RgpsPlanejamentoCalculosPlanejadosComponent', () => {
  let component: RgpsPlanejamentoCalculosPlanejadosComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoCalculosPlanejadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoCalculosPlanejadosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoCalculosPlanejadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
