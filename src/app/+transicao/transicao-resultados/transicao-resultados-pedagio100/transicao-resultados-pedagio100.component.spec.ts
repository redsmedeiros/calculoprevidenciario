import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransicaoResultadosPedagio100Component } from './transicao-resultados-pedagio100.component';

describe('TransicaoResultadosPedagio100Component', () => {
  let component: TransicaoResultadosPedagio100Component;
  let fixture: ComponentFixture<TransicaoResultadosPedagio100Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransicaoResultadosPedagio100Component ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransicaoResultadosPedagio100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
