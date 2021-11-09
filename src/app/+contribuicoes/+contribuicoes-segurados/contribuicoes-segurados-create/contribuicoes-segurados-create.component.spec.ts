import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesSeguradosCreateComponent } from './contribuicoes-segurados-create.component';

describe('ContribuicoesSeguradosCreateComponent', () => {
  let component: ContribuicoesSeguradosCreateComponent;
  let fixture: ComponentFixture<ContribuicoesSeguradosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesSeguradosCreateComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesSeguradosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
