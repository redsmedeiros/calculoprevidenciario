import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorCnisCalculosComponent } from './importador-cnis-calculos.component';

describe('ImportadorCnisCalculosComponent', () => {
  let component: ImportadorCnisCalculosComponent;
  let fixture: ComponentFixture<ImportadorCnisCalculosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisCalculosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorCnisCalculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
