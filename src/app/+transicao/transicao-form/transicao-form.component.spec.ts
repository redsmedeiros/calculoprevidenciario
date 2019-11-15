import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransicaoFormComponent } from './transicao-form.component';

describe('TransicaoFormComponent', () => {
  let component: TransicaoFormComponent;
  let fixture: ComponentFixture<TransicaoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransicaoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransicaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
