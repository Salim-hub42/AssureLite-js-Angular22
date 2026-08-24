import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ContratLigne } from './contrat-ligne';

describe('ContratLigne', () => {
  let component: ContratLigne;
  let fixture: ComponentFixture<ContratLigne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratLigne],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratLigne);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('contrat', {
      id: 1,
      clientId: 1,
      type: 'auto',
      statut: 'actif',
      prime: 50,
      dateDebut: new Date(2023, 0, 15),
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
