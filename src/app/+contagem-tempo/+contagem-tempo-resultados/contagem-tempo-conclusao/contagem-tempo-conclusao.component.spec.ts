import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoConclusaoComponent } from './contagem-tempo-conclusao.component';

describe('ContagemTempoConclusaoComponent', () => {
  let component: ContagemTempoConclusaoComponent;
  let fixture: ComponentFixture<ContagemTempoConclusaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoConclusaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoConclusaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
