import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorCnisCalculosComponent } from './importador-cnis-calculos.component';

describe('ImportadorCnisCalculosComponent', () => {
  let component: ImportadorCnisCalculosComponent;
  let fixture: ComponentFixture<ImportadorCnisCalculosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisCalculosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorCnisCalculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
