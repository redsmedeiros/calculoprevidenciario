import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorRgpsCalculosListComponent } from './importador-rgps-calculos-list.component';

describe('ImportadorRgpsCalculosListComponent', () => {
  let component: ImportadorRgpsCalculosListComponent;
  let fixture: ComponentFixture<ImportadorRgpsCalculosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorRgpsCalculosListComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorRgpsCalculosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
