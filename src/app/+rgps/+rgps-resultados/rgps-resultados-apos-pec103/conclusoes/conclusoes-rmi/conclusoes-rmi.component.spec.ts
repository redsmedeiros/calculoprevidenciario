import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConclusoesRmiComponent } from './conclusoes-rmi.component';

describe('ConclusoesRmiComponent', () => {
  let component: ConclusoesRmiComponent;
  let fixture: ComponentFixture<ConclusoesRmiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConclusoesRmiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConclusoesRmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
