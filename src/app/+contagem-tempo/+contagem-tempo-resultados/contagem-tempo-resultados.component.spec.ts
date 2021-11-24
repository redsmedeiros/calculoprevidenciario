import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoResultadosComponent } from './contagem-tempo-resultados.component';

describe('+contagemTempoResultadosComponent', () => {
  let component: ContagemTempoResultadosComponent;
  let fixture: ComponentFixture<ContagemTempoResultadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoResultadosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
