import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'masquerEmail',
})
export class MasquerEmailPipe implements PipeTransform {
  transform(email: string): string {
    const position = email.indexOf('@');
    if (position === -1) {
      return email; // pas un email valide
    }
    const nom = email.substring(0, position);
    return nom.slice(0, 2) + '***' + email.substring(position);
  }
}
