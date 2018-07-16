import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosCalculosCreateComponent } from './beneficios-calculos-create.component';

describe('BeneficiosCalculosCreateComponent', () => {
  let component: BeneficiosCalculosCreateComponent;
  let fixture: ComponentFixture<BeneficiosCalculosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosCalculosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosCalculosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
