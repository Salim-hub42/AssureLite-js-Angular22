import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsSinistres } from './stats-sinistres';

describe('StatsSinistres', () => {
  let component: StatsSinistres;
  let fixture: ComponentFixture<StatsSinistres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsSinistres],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsSinistres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
