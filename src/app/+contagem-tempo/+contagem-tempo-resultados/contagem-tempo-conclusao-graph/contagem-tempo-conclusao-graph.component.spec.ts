import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoConclusaoGraphComponent } from './contagem-tempo-conclusao-graph.component';

describe('ContagemTempoConclusaoGraphComponent', () => {
  let component: ContagemTempoConclusaoGraphComponent;
  let fixture: ComponentFixture<ContagemTempoConclusaoGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoConclusaoGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoConclusaoGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
