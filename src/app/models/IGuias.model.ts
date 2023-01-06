export interface IGuias {
  id_guia?: number;
  idGuia_Padre?: number;
  isGuiaPadre?: string;
  Codigo: string;
  Descripcion: string;
  TablaValor: string;
  Estado: 0 | 1;
  EstadoDsc: 'ACTIVO' | 'INACTIVO';
}

export class Guias implements IGuias {
  id_guia?: number;
  idGuia_Padre?: number;
  isGuiaPadre?: string;
  Codigo: string;
  Descripcion: string;
  TablaValor: string;
  Estado: 0 | 1;
  EstadoDsc: "ACTIVO" | "INACTIVO";

  constructor() { }
}

export class Motivos {
  id_motivos?: number;
  tipo_motivo: string;
  id_resultado: number;

  constructor() { }
}
