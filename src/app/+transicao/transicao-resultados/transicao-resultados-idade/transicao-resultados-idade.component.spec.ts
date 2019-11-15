import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransicaoResultadosIdadeComponent } from './transicao-resultados-idade.component';

describe('TransicaoResultadosIdadeComponent', () => {
  let component: TransicaoResultadosIdadeComponent;
  let fixture: ComponentFixture<TransicaoResultadosIdadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransicaoResultadosIdadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransicaoResultadosIdadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
