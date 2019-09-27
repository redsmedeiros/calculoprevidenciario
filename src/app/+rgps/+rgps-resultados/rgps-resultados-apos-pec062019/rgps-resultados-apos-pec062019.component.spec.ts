import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsResultadosAposPec062019Component } from './rgps-resultados-apos-pec062019.component';

describe('RgpsResultadosAposPec062019Component', () => {
  let component: RgpsResultadosAposPec062019Component;
  let fixture: ComponentFixture<RgpsResultadosAposPec062019Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsResultadosAposPec062019Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsResultadosAposPec062019Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
