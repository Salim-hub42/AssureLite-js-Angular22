import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ListeContrats } from './liste-contrats';

describe('ListeContrats', () => {
  let component: ListeContrats;
  let fixture: ComponentFixture<ListeContrats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeContrats],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeContrats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
