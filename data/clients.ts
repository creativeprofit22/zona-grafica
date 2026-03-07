export interface Client {
  name: string;
  sector?: string;
}

export const clients: Client[] = [
  { name: "GIFF", sector: "Cultura" },
  { name: "Festival Internacional Cervantino", sector: "Cultura" },
  { name: "Consejo Turístico de San Miguel de Allende", sector: "Turismo" },
  { name: "Cardo Café", sector: "Iniciativa Privada" },
  { name: "Lobby Restaurante", sector: "Iniciativa Privada" },
  { name: "Duncan Galería", sector: "Arte" },
  { name: "Zeferino Mezcal", sector: "Iniciativa Privada" },
  { name: "Geek Store", sector: "Iniciativa Privada" },
  { name: "CPI", sector: "Iniciativa Privada" },
  { name: "Prospecta", sector: "Iniciativa Privada" },
  { name: "Casa Misha", sector: "Turismo" },
  { name: "Artes de México", sector: "Cultura" },
  { name: "Municipio de San Miguel de Allende", sector: "Cultura" },
  { name: "Gobierno del Estado de Guanajuato", sector: "Cultura" },
];
