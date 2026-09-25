import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification-service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('démarre avec une file vide et rien à afficher', () => {
    expect(service.file()).toEqual([]);
    expect(service.courante()).toBeUndefined();
  });

  // Règle 1 : un message normal se place à la fin (push), l'ordre d'arrivée est respecté
  it('affiche les messages normaux dans leur ordre d’arrivée', () => {
    service.info('Contrat souscrit');
    service.info('Contrat supprimé');

    expect(service.file().map((n) => n.texte)).toEqual(['Contrat souscrit', 'Contrat supprimé']);
    expect(service.courante()?.texte).toBe('Contrat souscrit');
  });

  // Règle 2 : une erreur passe devant (unshift)
  it('fait passer une erreur devant les messages normaux', () => {
    service.info('Contrat souscrit');
    service.erreur('Échec de la suppression');

    expect(service.courante()).toEqual({ type: 'erreur', texte: 'Échec de la suppression' });
    expect(service.file()).toHaveLength(2);
  });

  // Règle 3 : fermer retire la première (shift) et affiche la suivante
  it('affiche la notification suivante après fermeture', () => {
    service.info('Premier');
    service.info('Second');

    service.fermer();

    expect(service.courante()?.texte).toBe('Second');
    expect(service.file()).toHaveLength(1);
  });

  it('ne plante pas si on ferme alors que la file est vide', () => {
    service.fermer();

    expect(service.file()).toEqual([]);
  });
});
