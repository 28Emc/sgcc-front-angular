export interface ITiposRecibo {
    idTipoRecibo?: number;
    tipoRecibo: string;
    descripcion: string;
}

export class TiposRecibo implements ITiposRecibo {
    idTipoRecibo?: number = 0;
    tipoRecibo: string = '';
    descripcion: string = '';
}