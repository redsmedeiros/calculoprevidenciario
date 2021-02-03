import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoCalculoComponent } from './rgps-planejamento-calculo.component';

describe('RgpsPlanejamentoCalculoComponent', () => {
  let component: RgpsPlanejamentoCalculoComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoCalculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoCalculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoCalculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
