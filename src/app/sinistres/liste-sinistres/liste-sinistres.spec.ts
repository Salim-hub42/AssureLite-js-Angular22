import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ListeSinistres } from './liste-sinistres';

describe('ListeSinistres', () => {
  let component: ListeSinistres;
  let fixture: ComponentFixture<ListeSinistres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeSinistres],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeSinistres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
