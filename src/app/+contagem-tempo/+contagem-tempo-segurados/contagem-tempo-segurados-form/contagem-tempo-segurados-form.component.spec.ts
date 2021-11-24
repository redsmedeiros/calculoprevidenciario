import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoSeguradosFormComponent } from './contagem-tempo-segurados-form.component';

describe('ContagemTempoSeguradosFormComponent', () => {
  let component: ContagemTempoSeguradosFormComponent;
  let fixture: ComponentFixture<ContagemTempoSeguradosFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoSeguradosFormComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoSeguradosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
