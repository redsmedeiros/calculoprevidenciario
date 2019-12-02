import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialListComponent } from './tutorial-list.component';

describe('TutorialListComponent', () => {
  let component: TutorialListComponent;
  let fixture: ComponentFixture<TutorialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialListComponent ]
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