export interface IRoles {
  id_rol?: number;
  rol: string;
  descripcion: string;
  ruta: string;
}

export class Roles implements IRoles {
  id_rol?: number;
  rol: string;
  descripcion: string;
  ruta: string;

  constructor() { }
}
