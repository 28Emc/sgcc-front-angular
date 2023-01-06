import { IRoles, Roles } from 'src/app/models/IRoles.model';
import { IPersonas, Personas } from './IUser.model';

export interface IInquilinos {
    idUsuario?: number;
    idInquilino?: number;
    rol: IRoles;
    persona: IPersonas;
    usuario: string;
    password: string;
    estado: 'A' | 'B';
    estadoDsc: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    fechaBaja: string;
    isActivo: boolean;
}

export class Inquilinos implements IInquilinos {
    idUsuario?: number = 0;
    idInquilino?: number = 0;
    rol: IRoles = new Roles();
    persona: IPersonas = new Personas();
    usuario: string = '';
    password: string = '';
    estado: 'A' | 'B' = 'B';
    estadoDsc: string;
    fechaCreacion: string = '';
    fechaActualizacion: string = null;
    fechaBaja: string = null;
    isActivo: boolean = false;
}

export interface IInquilinosPersonas {
    idUsuario?: number;
    idInquilino?: number;
    idPersona?: number;
    estado: 'A' | 'B';
    apellidoPaterno: string;
    nroDocumento: string;
    telefono: string;
    idRol: number;
    direccion: string;
    apellidoMaterno: string;
    usuario: string;
    tipoDocumento: string;
    genero: 'M' | 'F' | 'N';
    nombres: string;
    email: string;
}

export interface IInquilinosList {
    idUsuario: number;
    idInquilino?: number;
    usuario: string;
    password?: string;
    estado: 'A' | 'B';
    estadoDsc: string;
    fechaInicioContrato: string;
    fechaFinContrato: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    fechaBaja: string;
    isActivo: boolean;
    idPersona: number;
    tipoDocumento: string;
    nroDocumento: string;
    genero: 'M' | 'F' | 'N';
    generoDsc: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombreCompleto: string;
    direccion: string;
    telefono: string;
    email: string;
    idRol: number;
    rol: string;
    descripcion: string;
    ruta: string;
}