import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoSeguradosCreateComponent } from './contagem-tempo-segurados-create.component';

describe('ContagemTempoSeguradosCreateComponent', () => {
  let component: ContagemTempoSeguradosCreateComponent;
  let fixture: ComponentFixture<ContagemTempoSeguradosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoSeguradosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoSeguradosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
