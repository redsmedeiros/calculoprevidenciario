import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoComponent } from './rgps-planejamento.component';

describe('RgpsPlanejamentoComponent', () => {
  let component: RgpsPlanejamentoComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
