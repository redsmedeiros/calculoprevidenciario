import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsResultadosApos99SecundariosComponent } from './rgps-resultados-apos99-secundarios.component';

describe('RgpsResultadosApos99SecundariosComponent', () => {
  let component: RgpsResultadosApos99SecundariosComponent;
  let fixture: ComponentFixture<RgpsResultadosApos99SecundariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsResultadosApos99SecundariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsResultadosApos99SecundariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
