import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportadorCnisSeguradosListComponent } from './importador-cnis-segurados-list.component';


describe('RgpsPlanejamentoSeguradosListComponent', () => {
  let component: ImportadorCnisSeguradosListComponent;
  let fixture: ComponentFixture<ImportadorCnisSeguradosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisSeguradosListComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorCnisSeguradosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
