import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { +contagemTempoCalculosComponent } from './+contagem-tempo-calculos.component';

describe('+contagemTempoCalculosComponent', () => {
  let component: +contagemTempoCalculosComponent;
  let fixture: ComponentFixture<+contagemTempoCalculosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ +contagemTempoCalculosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(+contagemTempoCalculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
