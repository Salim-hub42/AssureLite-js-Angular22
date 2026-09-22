import { Session } from './utilisateur.model';

export const CLE_SESSION = 'assurlite-session';

export function ecrireSession(session: Session): void {
  const texte = JSON.stringify(session);
  localStorage.setItem(CLE_SESSION, texte);
}

export function lireSession(): Session | null {
  const brut = localStorage.getItem(CLE_SESSION);
  if (brut === null) {
    return null;
  }
  try {
    const result = JSON.parse(brut) as Session;
    return result;
  } catch {
    localStorage.removeItem(CLE_SESSION); // donnée corrompue : on nettoie
    return null;
  }
}

export function effacerSession(): void {
  localStorage.removeItem(CLE_SESSION);
}
