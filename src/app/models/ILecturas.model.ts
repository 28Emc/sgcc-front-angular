export interface ILecturasList {
    idLectura: number;
    idRecibo: number;
    idInquilino: number;
    idConsumo: number;
    nombreCompletoInquilino: string;
    mesRecibo: string;
    recibo: string;
    lecturaMedidorAnterior: number;
    lecturaMedidorActual: number;
    consumoMedidor: number;
    consumoUnitario: number;
    importe: number;
    fechaRegistro: string;
    fechaActualizacion: string;
}

export interface ILecturaRegister {
    idRecibo: number;
    idInquilino: number;
    lecturaMedidorActual: number;
}

export interface ILecturaUpdate {
    idLectura: number;
    idConsumo: number;
    idRecibo: number;
    idInquilino: number;
    lecturaMedidorAnterior: number;
    lecturaMedidorActual: number;
}