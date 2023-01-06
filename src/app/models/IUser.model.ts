import { IRoles, Roles } from 'src/app/models/IRoles.model';
import { DateTime } from 'luxon';

export interface IUserLogin {
    id_usuario?: number;
    usuario: string;
    password: string;
    fecha_inicio_sesion?: string;
}

export class UserLogin implements IUserLogin {
    id_usuario: number = 0;
    usuario: string = '';
    password: string = '';
    fecha_inicio_sesion: string = DateTime.local().toFormat('dd-MM-yyyy HH:mm:ss');
}

export interface IUsuarios {
    idUsuario?: number;
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

export interface IPersonas {
    idPersona?: number;
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
}

export class Usuarios implements IUsuarios {
    idUsuario?: number = 0;
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

export class Personas implements IPersonas {
    idPersona?: number = 0;
    tipoDocumento: string = '';
    nroDocumento: string = '';
    genero: 'M' | 'F' | 'N' = 'N';
    generoDsc: string;
    nombres: string = '';
    apellidoPaterno: string = '';
    apellidoMaterno: string = '';
    nombreCompleto: string = '';
    direccion: string = '';
    telefono: string = '';
    email: string = '';
}

export interface IUsuariosPersonas {
    idUsuario?: number;
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

export interface IUsuariosList {
    idUsuario: number;
    usuario: string;
    password?: string;
    estado: 'A' | 'B';
    estadoDsc: string;
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
