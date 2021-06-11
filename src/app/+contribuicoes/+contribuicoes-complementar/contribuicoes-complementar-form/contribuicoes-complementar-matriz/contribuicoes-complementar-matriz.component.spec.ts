import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesComplementarMatrizComponent } from './contribuicoes-complementar-matriz.component';

describe('ContribuicoesComplementarMatrizComponent', () => {
  let component: ContribuicoesComplementarMatrizComponent;
  let fixture: ComponentFixture<ContribuicoesComplementarMatrizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesComplementarMatrizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesComplementarMatrizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
