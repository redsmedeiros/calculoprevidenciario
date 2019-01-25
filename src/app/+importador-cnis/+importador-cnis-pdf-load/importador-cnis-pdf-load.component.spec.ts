import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorCnisPdfLoadComponent } from './importador-cnis-pdf-load.component';

describe('ImportadorCnisPdfLoadComponent', () => {
  let component: ImportadorCnisPdfLoadComponent;
  let fixture: ComponentFixture<ImportadorCnisPdfLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorCnisPdfLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorCnisPdfLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
