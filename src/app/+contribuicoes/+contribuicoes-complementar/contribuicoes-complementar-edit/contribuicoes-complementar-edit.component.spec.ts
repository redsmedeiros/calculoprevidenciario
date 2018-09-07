import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesComplementarEditComponent } from './contribuicoes-complementar-edit.component';

describe('ContribuicoesComplementarEditComponent', () => {
  let component: ContribuicoesComplementarEditComponent;
  let fixture: ComponentFixture<ContribuicoesComplementarEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesComplementarEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesComplementarEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
