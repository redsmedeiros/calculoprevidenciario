import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorCnisSeguradosComponent } from './+importador-cnis-segurados.component';

describe('ImportadorCnisSeguradosComponent', () => {
  let component: ImportadorCnisSeguradosComponent;
  let fixture: ComponentFixture<ImportadorCnisSeguradosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisSeguradosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorCnisSeguradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
