import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransicaoResultadosIdadeProgressivaComponent } from './transicao-resultados-idade-progressiva.component';

describe('TransicaoResultadosIdadeProgressivaComponent', () => {
  let component: TransicaoResultadosIdadeProgressivaComponent;
  let fixture: ComponentFixture<TransicaoResultadosIdadeProgressivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransicaoResultadosIdadeProgressivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransicaoResultadosIdadeProgressivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
