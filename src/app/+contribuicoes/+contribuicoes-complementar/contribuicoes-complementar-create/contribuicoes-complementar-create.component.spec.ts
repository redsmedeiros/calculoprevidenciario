import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesComplementarCreateComponent } from './contribuicoes-complementar-create.component';

describe('ContribuicoesComplementarCreateComponent', () => {
  let component: ContribuicoesComplementarCreateComponent;
  let fixture: ComponentFixture<ContribuicoesComplementarCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesComplementarCreateComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesComplementarCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
