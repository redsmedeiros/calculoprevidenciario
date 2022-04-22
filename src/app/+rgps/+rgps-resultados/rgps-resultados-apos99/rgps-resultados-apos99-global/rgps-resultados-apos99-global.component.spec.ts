import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsResultadosApos99GlobalComponent } from './rgps-resultados-apos99-global.component';

describe('RgpsResultadosApos99GlobalComponent', () => {
  let component: RgpsResultadosApos99GlobalComponent;
  let fixture: ComponentFixture<RgpsResultadosApos99GlobalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsResultadosApos99GlobalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsResultadosApos99GlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
