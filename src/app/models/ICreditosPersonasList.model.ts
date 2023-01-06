export interface ICreditosPersonasList {
  id_credito?: number;
  id_persona?: number;
  nombre_credito: string;
  total_creditos: number;
  credito_ejecutado?: number;
  credito_pendiente?: number;
  credito_vencido?: number;
  nombre_completo?: string;
  estado: string;
  estado_credito_dsc: string;
  estado_labels?: {
    text_class: string,
    bg_class: string,
    preview_class: string,
    icon?: string
  };
  id_plan: number;
  tipo_plan: number;
  tipo_plan_detalle: string;
  limite_inferior: number;
  limite_superior: number;
  usuario_creacion?: string;
  usuario_modificacion?: string;
}

export class CreditosPersonasList {
  id_credito?: number;
  campana: string;
  total_creditos: number;
  estado: string;
  id_plan: number;
  tipo_plan_detalle: string;
  limite_superior: number;
  usuario_creacion?: string;
  usuario_modificacion?: string;
  personas_list: CreditosAsignacion[];
}

export class CreditosAsignacion {
  id_persona: number;
  total_creditos: number;
  credito_ejecutado: number;
  credito_pendiente: number;
  credito_vencido: number;
}

export class CreditosPersonaExport {
  constructor(
    public nombre_credito: string,
    public total_creditos: number,
    public estado_credito: string,
    public tipo_plan: string,
    public limite_inferior: number,
    public limite_superior: number
  ) {

  }
}
