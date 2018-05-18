import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpsCalculosDestroyComponent } from './rgps-calculos-destroy.component';

describe('RgpsCalculosDestroyComponent', () => {
  let component: RgpsCalculosDestroyComponent;
  let fixture: ComponentFixture<RgpsCalculosDestroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgpsCalculosDestroyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpsCalculosDestroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
