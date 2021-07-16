import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorRgpsCalculosComponent } from './importador-rgps-calculos.component';

describe('ImportadorRgpsCalculosComponent', () => {
  let component: ImportadorRgpsCalculosComponent;
  let fixture: ComponentFixture<ImportadorRgpsCalculosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorRgpsCalculosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorRgpsCalculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
