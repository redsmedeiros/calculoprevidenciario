import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorCnisPeriodosComponent } from './importador-cnis-periodos.component';

describe('ImportadorCnisPeriodosComponent', () => {
  let component: ImportadorCnisPeriodosComponent;
  let fixture: ComponentFixture<ImportadorCnisPeriodosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisPeriodosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorCnisPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
