import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransicaoResultadosPedagio50Component } from './transicao-resultados-pedagio50.component';

describe('TransicaoResultadosPedagio50Component', () => {
  let component: TransicaoResultadosPedagio50Component;
  let fixture: ComponentFixture<TransicaoResultadosPedagio50Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransicaoResultadosPedagio50Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransicaoResultadosPedagio50Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
