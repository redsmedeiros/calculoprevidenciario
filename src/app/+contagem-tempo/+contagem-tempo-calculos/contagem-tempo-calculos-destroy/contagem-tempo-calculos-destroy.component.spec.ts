import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContagemTempoCalculosDestroyComponent } from './contagem-tempo-calculos-destroy.component';


describe('ContagemTempoCalculosDestroyComponent', () => {
  let component: ContagemTempoCalculosDestroyComponent;
  let fixture: ComponentFixture<ContagemTempoCalculosDestroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContagemTempoCalculosDestroyComponent ]
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
