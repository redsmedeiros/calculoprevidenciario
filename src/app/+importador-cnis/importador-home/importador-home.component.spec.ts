import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorHomeComponent } from './importador-home.component';

describe('ImportadorHomeComponent', () => {
  let component: ImportadorHomeComponent;
  let fixture: ComponentFixture<ImportadorHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
