import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoConclusaoExportarRgpsComponent } from './contagem-tempo-conclusao-exportar-rgps.component';

describe('ContagemTempoConclusaoExportarRgpsComponent', () => {
  let component: ContagemTempoConclusaoExportarRgpsComponent;
  let fixture: ComponentFixture<ContagemTempoConclusaoExportarRgpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoConclusaoExportarRgpsComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoConclusaoExportarRgpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
