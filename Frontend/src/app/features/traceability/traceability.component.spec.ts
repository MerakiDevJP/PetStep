import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceabilityComponent } from './traceability.component';

describe('Traceability', () => {
  let component: TraceabilityComponent;
  let fixture: ComponentFixture<TraceabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraceabilityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TraceabilityComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
