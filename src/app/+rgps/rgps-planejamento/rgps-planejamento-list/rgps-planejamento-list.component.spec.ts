import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsPlanejamentoListComponent } from './rgps-planejamento-list.component';

describe('RgpsPlanejamentoListComponent', () => {
  let component: RgpsPlanejamentoListComponent;
  let fixture: ComponentFixture<RgpsPlanejamentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsPlanejamentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsPlanejamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
