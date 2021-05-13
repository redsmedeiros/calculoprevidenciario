import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportadorCnisSeguradosListComponent } from './importador-cnis-segurados-list.component';


describe('RgpsPlanejamentoSeguradosListComponent', () => {
  let component: ImportadorCnisSeguradosListComponent;
  let fixture: ComponentFixture<ImportadorCnisSeguradosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisSeguradosListComponent ]
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
