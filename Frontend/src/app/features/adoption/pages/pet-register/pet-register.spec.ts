import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetRegister } from './pet-register';

describe('PetRegister', () => {
  let component: PetRegister;
  let fixture: ComponentFixture<PetRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(PetRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
