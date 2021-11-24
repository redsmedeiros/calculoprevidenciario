import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContagemTempoCalculosIndexComponent } from './contagem-tempo-calculos-index.component';

describe('ContagemTempoCalculosIndexComponent', () => {
  let component: ContagemTempoCalculosIndexComponent;
  let fixture: ComponentFixture<ContagemTempoCalculosIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContagemTempoCalculosIndexComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
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
