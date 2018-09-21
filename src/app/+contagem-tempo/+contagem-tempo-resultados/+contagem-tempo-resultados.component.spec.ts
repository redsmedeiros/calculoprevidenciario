import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { +contagemTempoResultadosComponent } from './+contagem-tempo-resultados.component';

describe('+contagemTempoResultadosComponent', () => {
  let component: +contagemTempoResultadosComponent;
  let fixture: ComponentFixture<+contagemTempoResultadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ +contagemTempoResultadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(+contagemTempoResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
