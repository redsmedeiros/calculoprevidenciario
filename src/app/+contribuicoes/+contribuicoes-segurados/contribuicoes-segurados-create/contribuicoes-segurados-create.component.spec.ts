import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesSeguradosCreateComponent } from './contribuicoes-segurados-create.component';

describe('ContribuicoesSeguradosCreateComponent', () => {
  let component: ContribuicoesSeguradosCreateComponent;
  let fixture: ComponentFixture<ContribuicoesSeguradosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesSeguradosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesSeguradosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
