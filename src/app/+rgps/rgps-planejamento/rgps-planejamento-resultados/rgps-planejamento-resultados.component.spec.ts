import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoResultadosComponent } from './rgps-planejamento-resultados.component';

describe('RgpsPlanejamentoResultadosComponent', () => {
  let component: RgpsPlanejamentoResultadosComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoResultadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoResultadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
