import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorCnisComponent } from './+importador-cnis.component';

describe('ImportadorCnisComponent', () => {
  let component: ImportadorCnisComponent;
  let fixture: ComponentFixture<ImportadorCnisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorCnisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
