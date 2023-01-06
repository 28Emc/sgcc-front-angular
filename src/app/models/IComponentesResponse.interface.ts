export interface IComponentesResponse {
    id_permiso: number;
    id_componente: number;
    id_componente_padre: number;
    componente: string;
    icono: string;
    ruta?: string;
    orden: number;
    hijos?: IComponentesResponse[];
    estado?: string;
}