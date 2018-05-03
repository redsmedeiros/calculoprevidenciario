import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuicoesSeguradosIndexComponent } from './contribuicoes-segurados-index.component';

describe('ContribuicoesSeguradosIndexComponent', () => {
  let component: ContribuicoesSeguradosIndexComponent;
  let fixture: ComponentFixture<ContribuicoesSeguradosIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribuicoesSeguradosIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuicoesSeguradosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
