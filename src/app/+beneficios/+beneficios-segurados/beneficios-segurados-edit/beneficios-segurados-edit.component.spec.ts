import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosSeguradosEditComponent } from './beneficios-segurados-edit.component';

describe('BeneficiosSeguradosEditComponent', () => {
  let component: BeneficiosSeguradosEditComponent;
  let fixture: ComponentFixture<BeneficiosSeguradosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiosSeguradosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiosSeguradosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
