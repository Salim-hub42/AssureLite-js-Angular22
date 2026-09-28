import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationSinistre } from './declaration-sinistre';

describe('DeclarationSinistre', () => {
  let component: DeclarationSinistre;
  let fixture: ComponentFixture<DeclarationSinistre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarationSinistre],
    }).compileComponents();

    fixture = TestBed.createComponent(DeclarationSinistre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
