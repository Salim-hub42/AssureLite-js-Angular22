import { Client } from "../models/client.model";
import { Contrat } from "../models/contrat.model";

export const CLIENTS_MOCKS: Client[] = [
   {id: 1, nom: 'Salim', email: 'sksnumerique@gmail.com', dateNaissance: new Date(1990,6,17)},
   {id: 2, nom: 'Jack', email: 'jack@gmail.com', dateNaissance: new Date(1995,7,20)}
];

export const CONTRATS_MOCKS: Contrat[] = [
     {id: 1, clientId: 1, type: 'auto', statut: 'actif', prime: 50 , dateDebut: new Date(2023, 0, 15)}, 
     {id: 2, clientId: 1, type: 'habitation', statut: 'suspendu', prime: 100 , dateDebut: new Date(2023, 5, 20)},
     {id: 3, clientId: 2, type: 'sante', statut: 'resilie', prime: 62 , dateDebut: new Date(2023, 4, 24)}, 
     {id: 4, clientId: 2, type: 'habitation', statut: 'actif', prime: 99 , dateDebut: new Date(2023, 6, 1)}
]

