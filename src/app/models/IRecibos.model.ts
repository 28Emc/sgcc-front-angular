import { ITiposRecibo, TiposRecibo } from './ITiposRecibo.model';

export interface IRecibos {
    idRecibo?: number;
    tipoRecibo: ITiposRecibo;
    urlArchivo: string;
    mesRecibo: number;
    mesReciboDsc?: string;
    direccionRecibo: string;
    consumoUnitario: number;
    importe: number;
    fechaRegistro: string;
    fechaActualizacion: string;
}

export class Recibos implements IRecibos {
    idRecibo?: number = 0;
    tipoRecibo: ITiposRecibo = new TiposRecibo();
    urlArchivo: string = '';
    mesRecibo: number = 0;
    direccionRecibo: string = '';
    consumoUnitario: number = 0.00;
    importe: number = 0.00;
    fechaRegistro: string = '';
    fechaActualizacion: string = '';
}

export interface IRecibosList {
    idRecibo: number;
    idTipoRecibo: number;
    tipoRecibo: string;
    descripcion: string;
    urlArchivo: string;
    mesRecibo: number;
    mesReciboDsc?: string;
    direccionRecibo: string;
    consumoUnitario: number;
    importe: number;
    fechaRegistro: string;
    fechaActualizacion: string;
}

export interface IRecibosRegister {
    idTipoRecibo: number;
    mesRecibo: string;
    consumoUnitario: number;
    importe: number;
    direccionRecibo: string;
    file: File;
}

export interface IRecibosUpdate {
    idRecibo: number;
    idTipoRecibo: number;
    mesRecibo: string;
    consumoUnitario: number;
    importe: number;
    urlRecibo: string;
    direccionRecibo: string;
}

export enum MESES {
    ENERO,
    FEBRERO,
    MARZO,
    ABRIL,
    MAYO,
    JUNIO,
    JULIO,
    AGOSTO,
    SEPTIEMBRE,
    OCTUBRE,
    NOVIEMBRE,
    DICIEMBRE
}