import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorCnisContribuicoesComponent } from './importador-cnis-contribuicoes.component';

describe('ImportadorCnisContribuicoesComponent', () => {
  let component: ImportadorCnisContribuicoesComponent;
  let fixture: ComponentFixture<ImportadorCnisContribuicoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisContribuicoesComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorCnisContribuicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
