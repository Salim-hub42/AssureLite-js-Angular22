export interface Utilisateur {
  id: number;
  email: string;
  password: string;
}

export interface Session {
  email: string;
  userId: number;
  token: string;
}
