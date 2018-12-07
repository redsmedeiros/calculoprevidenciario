import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoConclusaoExportarRgpsComponent } from './contagem-tempo-conclusao-exportar-rgps.component';

describe('ContagemTempoConclusaoExportarRgpsComponent', () => {
  let component: ContagemTempoConclusaoExportarRgpsComponent;
  let fixture: ComponentFixture<ContagemTempoConclusaoExportarRgpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoConclusaoExportarRgpsComponent ]
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
