import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoConclusaoSeguradoComponent } from './contagem-tempo-conclusao-segurado.component';

describe('ContagemTempoConclusaoSeguradoComponent', () => {
  let component: ContagemTempoConclusaoSeguradoComponent;
  let fixture: ComponentFixture<ContagemTempoConclusaoSeguradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoConclusaoSeguradoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoConclusaoSeguradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
