import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoSeguradosEditComponent } from './contagem-tempo-segurados-edit.component';

describe('ContagemTempoSeguradosEditComponent', () => {
  let component: ContagemTempoSeguradosEditComponent;
  let fixture: ComponentFixture<ContagemTempoSeguradosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContagemTempoSeguradosEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoSeguradosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
