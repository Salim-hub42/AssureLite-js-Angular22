import { Component, computed, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Sinistre } from '../../models/sinistre.model';
import { montantTotalSinistres } from '../../models/sinistre.utils';

@Component({
  selector: 'app-stats-sinistres',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './stats-sinistres.html',
  styleUrl: './stats-sinistres.scss',
})
export class StatsSinistres {
  readonly sinistres = input.required<Sinistre[]>();
  readonly primeTotale = input.required<number>();

  readonly nombre = computed(() => this.sinistres().length);

  readonly montantTotal = computed(() => montantTotalSinistres(this.sinistres()));

  readonly taux = computed(() => {
    const primes = this.primeTotale();
    if (primes === 0) {
      return null;
    }
    const taux = (this.montantTotal() / primes) * 100;
    return Number(taux.toPrecision(3)); // toPrecision arrondit ; Number() retire la notation scientifique (6.48e+3 → 6480)
  });
}
