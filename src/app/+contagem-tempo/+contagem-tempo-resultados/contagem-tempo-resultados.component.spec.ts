import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoResultadosComponent } from './contagem-tempo-resultados.component';

describe('+contagemTempoResultadosComponent', () => {
  let component: ContagemTempoResultadosComponent;
  let fixture: ComponentFixture<ContagemTempoResultadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoResultadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
