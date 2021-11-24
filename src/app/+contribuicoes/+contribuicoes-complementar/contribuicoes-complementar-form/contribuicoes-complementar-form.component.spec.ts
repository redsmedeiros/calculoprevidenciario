import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesComplementarFormComponent } from './contribuicoes-complementar-form.component';

describe('ContribuicoesComplementarFormComponent', () => {
  let component: ContribuicoesComplementarFormComponent;
  let fixture: ComponentFixture<ContribuicoesComplementarFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesComplementarFormComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesComplementarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
