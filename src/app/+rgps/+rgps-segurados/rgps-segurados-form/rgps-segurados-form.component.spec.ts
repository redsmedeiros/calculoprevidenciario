import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsSeguradosFormComponent } from './rgps-segurados-form.component';

describe('RgpsSeguradosFormComponent', () => {
  let component: RgpsSeguradosFormComponent;
  let fixture: ComponentFixture<RgpsSeguradosFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsSeguradosFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsSeguradosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
