import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleEduComponent } from './responsible-edu.component';

describe('ResponsibleEduComponent', () => {
  let component: ResponsibleEduComponent;
  let fixture: ComponentFixture<ResponsibleEduComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsibleEduComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibleEduComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
