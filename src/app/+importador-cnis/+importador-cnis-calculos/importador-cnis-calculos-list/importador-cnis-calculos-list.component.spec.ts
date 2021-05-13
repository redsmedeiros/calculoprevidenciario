import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorCnisCalculosListComponent } from './importador-cnis-calculos-list.component';

describe('ImportadorCnisCalculosListComponent', () => {
  let component: ImportadorCnisCalculosListComponent;
  let fixture: ComponentFixture<ImportadorCnisCalculosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisCalculosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorCnisCalculosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
