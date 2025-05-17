import { z } from 'zod';

const schema = z
  .object({
    salaire: z
    .number()
    .describe("Le salaire brut mensuel du client."),
    dettes: z
    .number()
    .describe("Le montant total des dettes du client."),
    loyer: z   
    .number()
    .describe("Le montant du loyer mensuel du client."),
    metier : z
    .string() 
    .describe("Le métier du client."),
    age: z
    .number()
    .describe("L'âge du client."),
  })
  .describe("Le schéma de validation des données du client.");

  export const extractDataFromInvoice = async (
    invoicePath: string,
  ) => {
    await generateObject({
    model: 'mistral',
    system :
    'Tu vas recevoir un document PDF contenant des informations sur un client. Tu dois extraire les informations suivantes : salaire, dettes, loyer, métier et âge. Tu dois renvoyer ces informations sous forme de JSON. Voici le document : ',
    schema,

  });


     