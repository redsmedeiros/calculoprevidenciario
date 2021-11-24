import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoIndexComponent } from './rgps-planejamento-index.component';

describe('RgpsPlanejamentoIndexComponent', () => {
  let component: RgpsPlanejamentoIndexComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoIndexComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
