import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoConclusaoPeriodosComponent } from './contagem-tempo-conclusao-periodos.component';

describe('ContagemTempoConclusaoPeriodosComponent', () => {
  let component: ContagemTempoConclusaoPeriodosComponent;
  let fixture: ComponentFixture<ContagemTempoConclusaoPeriodosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoConclusaoPeriodosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoConclusaoPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
