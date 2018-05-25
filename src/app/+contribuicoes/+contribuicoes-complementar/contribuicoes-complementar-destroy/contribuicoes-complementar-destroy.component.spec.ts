import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesComplementarDestroyComponent } from './contribuicoes-complementar-destroy.component';

describe('ContribuicoesComplementarDestroyComponent', () => {
  let component: ContribuicoesComplementarDestroyComponent;
  let fixture: ComponentFixture<ContribuicoesComplementarDestroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesComplementarDestroyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesComplementarDestroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
