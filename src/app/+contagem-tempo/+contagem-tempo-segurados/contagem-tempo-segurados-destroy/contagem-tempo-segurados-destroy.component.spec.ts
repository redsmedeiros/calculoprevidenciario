import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoSeguradosDestroyComponent } from './contagem-tempo-segurados-destroy.component';

describe('ContagemTempoSeguradosDestroyComponent', () => {
  let component: ContagemTempoSeguradosDestroyComponent;
  let fixture: ComponentFixture<ContagemTempoSeguradosDestroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoSeguradosDestroyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoSeguradosDestroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
