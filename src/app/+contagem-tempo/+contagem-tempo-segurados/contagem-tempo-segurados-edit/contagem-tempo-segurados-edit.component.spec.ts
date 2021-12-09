import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoSeguradosEditComponent } from './contagem-tempo-segurados-edit.component';

describe('ContagemTempoSeguradosEditComponent', () => {
  let component: ContagemTempoSeguradosEditComponent;
  let fixture: ComponentFixture<ContagemTempoSeguradosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContagemTempoSeguradosEditComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoSeguradosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
