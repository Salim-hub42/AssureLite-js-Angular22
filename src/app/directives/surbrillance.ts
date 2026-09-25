import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appSurbrillance]',
  host: { '[class.assurlite-surbrillance]': 'actif()' },
})
export class Surbrillance {
  readonly actif = input(false, { alias: 'appSurbrillance' });
}
