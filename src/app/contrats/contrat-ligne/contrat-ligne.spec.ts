import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratLigne } from './contrat-ligne';

describe('ContratLigne', () => {
  let component: ContratLigne;
  let fixture: ComponentFixture<ContratLigne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratLigne],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratLigne);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
