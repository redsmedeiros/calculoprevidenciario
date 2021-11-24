
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculoAtrasadoService } from '../CalculoAtrasado.service';
import { StoreService } from 'app/services/store.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SeguradoService } from 'app/+beneficios/+beneficios-segurados/Segurado.service';

import { BeneficiosCalculosEditComponent } from './beneficios-calculos-edit.component';

describe('BeneficiosCalculosEditComponent', () => {
  let component: BeneficiosCalculosEditComponent;
  let fixture: ComponentFixture<BeneficiosCalculosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule  ,
        CommonModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [ BeneficiosCalculosEditComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers:[
        SeguradoService,
        CalculoAtrasadoService,
        StoreService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosCalculosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
