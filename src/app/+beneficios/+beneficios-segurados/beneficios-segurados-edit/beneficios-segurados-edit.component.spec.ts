import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosSeguradosEditComponent } from './beneficios-segurados-edit.component';

describe('BeneficiosSeguradosEditComponent', () => {
  let component: BeneficiosSeguradosEditComponent;
  let fixture: ComponentFixture<BeneficiosSeguradosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosSeguradosEditComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosSeguradosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
