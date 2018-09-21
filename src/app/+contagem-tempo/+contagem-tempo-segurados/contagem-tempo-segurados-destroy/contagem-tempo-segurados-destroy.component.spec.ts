import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsSeguradosDestroyComponent } from './rgps-segurados-destroy.component';

describe('RgpsSeguradosDestroyComponent', () => {
  let component: RgpsSeguradosDestroyComponent;
  let fixture: ComponentFixture<RgpsSeguradosDestroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsSeguradosDestroyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsSeguradosDestroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
