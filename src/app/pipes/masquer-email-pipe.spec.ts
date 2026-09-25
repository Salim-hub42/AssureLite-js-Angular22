import { MasquerEmailPipe } from './masquer-email-pipe';

describe('MasquerEmailPipe', () => {
  const pipe = new MasquerEmailPipe();

  it('garde les 2 premiers caractères et le domaine', () => {
    expect(pipe.transform('salim@gmail.com')).toBe('sa***@gmail.com');
  });

  it('fonctionne avec une partie avant le @ très courte', () => {
    expect(pipe.transform('a@b.fr')).toBe('a***@b.fr');
  });

  it("renvoie le texte tel quel s'il n'y a pas de @", () => {
    expect(pipe.transform('pas-un-email')).toBe('pas-un-email');
  });
});
