import { Component, computed, signal } from '@angular/core';
import {
  disabled,
  form,
  FormField,
  FormRoot,
  max,
  min,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';

// Domaine volontairement isolé (inscription à un événement, pas assurance) —
// même domaine que l'exemple du Module 5, mais en Signal Forms : le fichier se
// compare ligne à ligne avec 05-reactive-forms.example.ts.

/** Règle métier réutilisable, testable sans monter de formulaire. */
export function contientEspace(valeur: string): boolean {
  return valeur.includes(' ');
}

export function genererReference(prefixe: string): string {
  return `${prefixe}-${Math.floor(Math.random() * 100000)}`;
}

interface Inscription {
  nom: string;
  age: number | null;
  pseudo: string;
  avecInvites: boolean;
  nombreInvites: number;
}

@Component({
  selector: 'app-exemple-inscription-signal',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="f" (submit)="onSubmit($event)">
      <label for="nom">Nom</label>
      <input id="nom" [formField]="f.nom" />
      @if (f.nom().touched()) {
        @for (e of f.nom().errors(); track e.kind) {
          <p class="err">{{ e.message }}</p>
        }
      }

      <label for="age">Âge</label>
      <input id="age" type="number" [formField]="f.age" />
      @if (f.age().touched()) {
        @for (e of f.age().errors(); track e.kind) {
          <p class="err">{{ e.message }}</p>
        }
      }

      <label for="pseudo">Pseudo</label>
      <input id="pseudo" [formField]="f.pseudo" />
      @if (f.pseudo().touched()) {
        @for (e of f.pseudo().errors(); track e.kind) {
          <p class="err">{{ e.message }}</p>
        }
      }

      <label>
        <input type="checkbox" [formField]="f.avecInvites" />
        Venir avec des invités
      </label>

      <label for="nb">Nombre d'invités</label>
      <input id="nb" type="number" [formField]="f.nombreInvites" />

      <p>Prix total : {{ prixTotal() }} €</p>

      <button type="submit" [disabled]="f().invalid()">S'inscrire</button>
    </form>

    @if (reference(); as ref) {
      <p class="ref">Référence : {{ ref }}</p>
    }
  `,
})
export class ExempleInscriptionSignal {
  // 1. Le modèle : de la donnée brute, aucun type Angular.
  readonly model = signal<Inscription>({
    nom: '',
    age: null,
    pseudo: '',
    avecInvites: false,
    nombreInvites: 1,
  });

  // 2. form() enveloppe le modèle + applique un schéma de règles.
  readonly f = form(this.model, (path) => {
    required(path.nom, { message: 'Le nom est requis.' });
    minLength(path.nom, 2, { message: 'Au moins 2 caractères.' });

    required(path.age, { message: "L'âge est requis." });
    min(path.age, 18, { message: 'Âge minimum : 18 ans.' }); // remplace le validateur perso du Module 5

    required(path.pseudo, { message: 'Le pseudo est requis.' });
    validate(path.pseudo, ({ value }) =>
      contientEspace(value())
        ? { kind: 'sansEspace', message: "Pas d'espace dans le pseudo." }
        : null,
    );

    // Logique inter-champs : le nombre d'invités n'a de sens que si la case est cochée.
    // Un champ désactivé ne bloque pas la validité du formulaire.
    disabled(path.nombreInvites, { when: ({ valueOf }) => !valueOf(path.avecInvites) });
    min(path.nombreInvites, 1);
    max(path.nombreInvites, 10);
  });

  // 3. Valeur dérivée : un simple computed qui lit des signals de champ.
  //    Aucun valueChanges, aucun toSignal — comparer avec le Module 5.
  readonly prixTotal = computed(() => {
    const base = 20;
    const invites = this.f.avecInvites().value() ? this.f.nombreInvites().value() : 0;
    return base + invites * 10;
  });

  readonly reference = signal<string | null>(null);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    // submit() marque tout touched et n'exécute l'action QUE si le formulaire est valide.
    await submit(this.f, async (f) => {
      this.reference.set(genererReference('EVT'));
      return undefined; // ou des erreurs serveur : { kind, message }
    });
  }
}
