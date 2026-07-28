import { Client } from "./client.model";

export function rechercherClientParEmail(clients: Client[], email: string): Client | undefined {
   const normalize = email.trim().toLowerCase()
   return clients.find((client) => client.email.trim().toLowerCase() === normalize );
}