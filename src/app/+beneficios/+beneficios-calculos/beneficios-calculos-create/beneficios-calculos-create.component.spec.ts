
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosCalculosCreateComponent } from './beneficios-calculos-create.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CalculoAtrasadoService } from '../CalculoAtrasado.service';
import { StoreService } from 'app/services/store.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SeguradoService } from 'app/+beneficios/+beneficios-segurados/Segurado.service';


describe('BeneficiosCalculosCreateComponent', () => {
  let component: BeneficiosCalculosCreateComponent;
  let fixture: ComponentFixture<BeneficiosCalculosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule  ,
        CommonModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [BeneficiosCalculosCreateComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers:[
        SeguradoService,
        CalculoAtrasadoService,
        StoreService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosCalculosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
