import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosCalculosFormComponent } from './beneficios-calculos-form.component';

describe('BeneficiosCalculosFormComponent', () => {
  let component: BeneficiosCalculosFormComponent;
  let fixture: ComponentFixture<BeneficiosCalculosFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosCalculosFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosCalculosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
