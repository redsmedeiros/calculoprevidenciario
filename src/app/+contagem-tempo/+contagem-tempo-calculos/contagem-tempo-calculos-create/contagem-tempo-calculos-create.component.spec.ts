import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoCalculosCreateComponent } from './contagem-tempo-calculos-create.component';

describe('ContagemTempoCalculosCreateComponent', () => {
  let component: ContagemTempoCalculosCreateComponent;
  let fixture: ComponentFixture<ContagemTempoCalculosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContagemTempoCalculosCreateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoCalculosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
