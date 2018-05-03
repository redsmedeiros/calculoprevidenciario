import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosSeguradosIndexComponent } from './beneficios-segurados-index.component';

describe('BeneficiosSeguradosIndexComponent', () => {
  let component: BeneficiosSeguradosIndexComponent;
  let fixture: ComponentFixture<BeneficiosSeguradosIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosSeguradosIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosSeguradosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
