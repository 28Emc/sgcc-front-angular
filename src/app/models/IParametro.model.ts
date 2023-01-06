export interface IParametro {
  id_parametro?: number;
  grupo: string;
  valor: string;
  descripcion: string;
  estado: string;
  estadoDsc?: string;
}

export class Parametro implements IParametro {
  id_parametro?: number;
  grupo: string;
  valor: string;
  descripcion: string;
  estado: string;
  estadoDsc?: string;

  constructor() { }
}
