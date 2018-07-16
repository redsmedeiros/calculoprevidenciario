import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosCalculosIndexComponent } from './beneficios-calculos-index.component';

describe('BeneficiosCalculosIndexComponent', () => {
  let component: BeneficiosCalculosIndexComponent;
  let fixture: ComponentFixture<BeneficiosCalculosIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosCalculosIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosCalculosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
