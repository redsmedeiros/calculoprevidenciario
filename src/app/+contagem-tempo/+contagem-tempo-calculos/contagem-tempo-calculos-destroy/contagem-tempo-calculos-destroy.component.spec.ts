import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContagemTempoCalculosDestroyComponent } from './contagem-tempo-calculos-destroy.component';


describe('ContagemTempoCalculosDestroyComponent', () => {
  let component: ContagemTempoCalculosDestroyComponent;
  let fixture: ComponentFixture<ContagemTempoCalculosDestroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoCalculosDestroyComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContagemTempoCalculosDestroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
