export interface Utilisateur {
  id: number;
  email: string;
  password: string;
}

export interface Session {
  userId: number;
  token: string;
}
