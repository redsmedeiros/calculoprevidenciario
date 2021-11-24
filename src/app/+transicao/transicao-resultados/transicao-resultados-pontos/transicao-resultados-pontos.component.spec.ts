import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransicaoResultadosPontosComponent } from './transicao-resultados-pontos.component';

describe('TransicaoResultadosPontosComponent', () => {
  let component: TransicaoResultadosPontosComponent;
  let fixture: ComponentFixture<TransicaoResultadosPontosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransicaoResultadosPontosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransicaoResultadosPontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
