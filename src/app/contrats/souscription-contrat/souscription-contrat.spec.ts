import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscriptionContrat } from './souscription-contrat';

describe('SouscriptionContrat', () => {
  let component: SouscriptionContrat;
  let fixture: ComponentFixture<SouscriptionContrat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SouscriptionContrat],
    }).compileComponents();

    fixture = TestBed.createComponent(SouscriptionContrat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
