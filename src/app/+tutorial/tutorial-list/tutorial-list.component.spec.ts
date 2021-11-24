import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialListComponent } from './tutorial-list.component';

describe('TutorialListComponent', () => {
  let component: TutorialListComponent;
  let fixture: ComponentFixture<TutorialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialListComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
