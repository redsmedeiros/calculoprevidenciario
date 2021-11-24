import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCompetenciasComponent } from './lista-competencias.component';

describe('ListaCompetenciasComponent', () => {
  let component: ListaCompetenciasComponent;
  let fixture: ComponentFixture<ListaCompetenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaCompetenciasComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
