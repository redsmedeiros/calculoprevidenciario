import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoCalculosEditComponent } from './contagem-tempo-calculos-edit.component';

describe('ContagemTempoCalculosEditComponent', () => {
  let component: ContagemTempoCalculosEditComponent;
  let fixture: ComponentFixture<ContagemTempoCalculosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoCalculosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoCalculosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
