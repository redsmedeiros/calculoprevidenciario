import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosSeguradosCreateComponent } from './beneficios-segurados-create.component';

describe('BeneficiosSeguradosCreateComponent', () => {
  let component: BeneficiosSeguradosCreateComponent;
  let fixture: ComponentFixture<BeneficiosSeguradosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosSeguradosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosSeguradosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
