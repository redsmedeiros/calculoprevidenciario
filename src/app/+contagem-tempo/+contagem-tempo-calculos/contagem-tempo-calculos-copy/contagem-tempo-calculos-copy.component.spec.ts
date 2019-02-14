import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoCalculosCopyComponent } from './contagem-tempo-calculos-copy.component';

describe('ContagemTempoCalculosCopyComponent', () => {
  let component: ContagemTempoCalculosCopyComponent;
  let fixture: ComponentFixture<ContagemTempoCalculosCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoCalculosCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoCalculosCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
