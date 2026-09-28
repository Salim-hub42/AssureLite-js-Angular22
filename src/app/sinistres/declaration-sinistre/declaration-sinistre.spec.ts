import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DeclarationSinistre } from './declaration-sinistre';

describe('DeclarationSinistre', () => {
  let component: DeclarationSinistre;
  let fixture: ComponentFixture<DeclarationSinistre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarationSinistre],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DeclarationSinistre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
