import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscriptionContratSignal } from './souscription-contrat-signal';

describe('SouscriptionContratSignal', () => {
  let component: SouscriptionContratSignal;
  let fixture: ComponentFixture<SouscriptionContratSignal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SouscriptionContratSignal],
    }).compileComponents();

    fixture = TestBed.createComponent(SouscriptionContratSignal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
