import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesSeguradosEditComponent } from './contribuicoes-segurados-edit.component';

describe('ContribuicoesSeguradosEditComponent', () => {
  let component: ContribuicoesSeguradosEditComponent;
  let fixture: ComponentFixture<ContribuicoesSeguradosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesSeguradosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesSeguradosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
