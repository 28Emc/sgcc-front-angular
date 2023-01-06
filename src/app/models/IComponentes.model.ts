export interface IComponentes {
    idComponente: number;
    idComponentePadre: number;
    componente: string;
    descripcion: string;
    icono: string;
    ruta?: string;
    orden: number;
    estado?: string;
}

export class Componentes implements IComponentes {
    idComponente: number = 0;
    idComponentePadre: number = 0;
    componente: string = '';
    descripcion: string = null;
    icono: string = '';
    ruta?: string = '';
    orden: number = 0;
    estado?: string = 'B';
}