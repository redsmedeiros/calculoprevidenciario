import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsResultadosApos99SecundariosCalculoComponent } from './rgps-resultados-apos99-secundarios-calculo.component';

describe('RgpsResultadosApos99SecundariosCalculoComponent', () => {
  let component: RgpsResultadosApos99SecundariosCalculoComponent;
  let fixture: ComponentFixture<RgpsResultadosApos99SecundariosCalculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsResultadosApos99SecundariosCalculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsResultadosApos99SecundariosCalculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
