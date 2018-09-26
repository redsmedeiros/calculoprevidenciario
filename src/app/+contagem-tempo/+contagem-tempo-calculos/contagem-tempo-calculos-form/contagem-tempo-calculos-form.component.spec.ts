import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoCalculosFormComponent } from './contagem-tempo-calculos-form.component';

describe('ContagemTempoCalculosFormComponent', () => {
  let component: ContagemTempoCalculosFormComponent;
  let fixture: ComponentFixture<ContagemTempoCalculosFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoCalculosFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoCalculosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
