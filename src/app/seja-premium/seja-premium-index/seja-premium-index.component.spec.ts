import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SejaPremiumIndexComponent } from './seja-premium-index.component';

describe('SejaPremiumIndexComponent', () => {
  let component: SejaPremiumIndexComponent;
  let fixture: ComponentFixture<SejaPremiumIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SejaPremiumIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SejaPremiumIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
