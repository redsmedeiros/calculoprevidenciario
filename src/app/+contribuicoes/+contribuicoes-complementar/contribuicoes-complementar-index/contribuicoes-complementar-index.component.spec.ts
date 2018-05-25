import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesComplementarIndexComponent } from './contribuicoes-complementar-index.component';

describe('ContribuicoesComplementarIndexComponent', () => {
  let component: ContribuicoesComplementarIndexComponent;
  let fixture: ComponentFixture<ContribuicoesComplementarIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesComplementarIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesComplementarIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
