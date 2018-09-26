import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoCalculosIndexComponent } from './contagem-tempo-calculos-index.component';

describe('ContagemTempoCalculosIndexComponent', () => {
  let component: ContagemTempoCalculosIndexComponent;
  let fixture: ComponentFixture<ContagemTempoCalculosIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContagemTempoCalculosIndexComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoCalculosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
