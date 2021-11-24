import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoContribuicoesComponent } from './rgps-planejamento-contribuicoes.component';

describe('RgpsPlanejamentoContribuicoesComponent', () => {
  let component: RgpsPlanejamentoContribuicoesComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoContribuicoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoContribuicoesComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoContribuicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
