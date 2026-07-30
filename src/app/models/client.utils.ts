
import { Client } from "./client.model";

export function rechercherClientParEmail(clients: Client[], email: string): Client | undefined {
   const normalize = email.trim().toLowerCase()
   return clients.find((client) => client.email.trim().toLowerCase() === normalize );
}

export function calculerAge(dateNaissance: Date, aujourdHui: Date): number {
   let age = aujourdHui.getFullYear() - dateNaissance.getFullYear();
   if(aujourdHui.getMonth() < dateNaissance.getMonth() ||
     ( aujourdHui.getMonth() === dateNaissance.getMonth() &&
      aujourdHui.getDate() < dateNaissance.getDate()))
   {
     age--
   }
    return age;
}

export function listerClientsMajeurs(clients: Client[], aujourdHui: Date): Client[] {
       return clients.filter((client) => {
       return calculerAge(client.dateNaissance, aujourdHui) >= 18;
     })
}

