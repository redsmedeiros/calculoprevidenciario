import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransicaoResultadosComponent } from './transicao-resultados.component';

describe('TransicaoResultadosComponent', () => {
  let component: TransicaoResultadosComponent;
  let fixture: ComponentFixture<TransicaoResultadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransicaoResultadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransicaoResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
