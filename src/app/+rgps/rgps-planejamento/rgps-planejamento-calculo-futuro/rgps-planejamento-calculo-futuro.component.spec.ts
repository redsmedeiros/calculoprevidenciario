import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoCalculoFuturoComponent } from './rgps-planejamento-calculo-futuro.component';

describe('RgpsPlanejamentoCalculoFuturoComponent', () => {
  let component: RgpsPlanejamentoCalculoFuturoComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoCalculoFuturoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoCalculoFuturoComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoCalculoFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
