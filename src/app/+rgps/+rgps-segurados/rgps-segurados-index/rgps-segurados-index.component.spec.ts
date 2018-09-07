import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsSeguradosIndexComponent } from './rgps-segurados-index.component';

describe('RgpsSeguradosIndexComponent', () => {
  let component: RgpsSeguradosIndexComponent;
  let fixture: ComponentFixture<RgpsSeguradosIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsSeguradosIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsSeguradosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
