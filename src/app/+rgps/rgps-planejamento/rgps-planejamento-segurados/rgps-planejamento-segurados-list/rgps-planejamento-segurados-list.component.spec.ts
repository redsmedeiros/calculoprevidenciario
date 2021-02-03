import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoSeguradosListComponent } from './rgps-planejamento-segurados-list.component';

describe('RgpsPlanejamentoSeguradosListComponent', () => {
  let component: RgpsPlanejamentoSeguradosListComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoSeguradosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoSeguradosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoSeguradosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
