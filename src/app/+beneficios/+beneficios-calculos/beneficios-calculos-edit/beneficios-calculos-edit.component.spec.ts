import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosCalculosEditComponent } from './beneficios-calculos-edit.component';

describe('BeneficiosCalculosEditComponent', () => {
  let component: BeneficiosCalculosEditComponent;
  let fixture: ComponentFixture<BeneficiosCalculosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosCalculosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosCalculosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
