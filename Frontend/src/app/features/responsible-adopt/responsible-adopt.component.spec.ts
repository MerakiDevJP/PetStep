import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleAdoptComponent } from './responsible-adopt.component';

describe('ResponsibleAdoptComponent', () => {
  let component: ResponsibleAdoptComponent;
  let fixture: ComponentFixture<ResponsibleAdoptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsibleAdoptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibleAdoptComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
