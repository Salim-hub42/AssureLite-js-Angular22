import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ContratDetail } from './contrat-detail';

describe('ContratDetail', () => {
  let component: ContratDetail;
  let fixture: ComponentFixture<ContratDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratDetail);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
