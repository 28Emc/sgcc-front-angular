import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IComponentes } from 'src/app/models/IComponentes.model';
import { IInquilinosPersonas } from 'src/app/models/IInquilinos.model';
import { ILecturaRegister, ILecturaUpdate } from 'src/app/models/ILecturas.model';
import { IRecibosUpdate } from 'src/app/models/IRecibos.model';
import { IResponse } from 'src/app/models/IResponse.interface';
import { IRoles } from 'src/app/models/IRoles.model';
import { ITiposRecibo } from 'src/app/models/ITiposRecibo.model';
import { IUpdateEstado } from 'src/app/models/IUpdateEstado.interface';
import { IUsuariosPersonas } from 'src/app/models/IUser.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  header: HttpHeaders = new HttpHeaders();
  jwt: string = '';
  readonly urlBase: string = environment.rutaBase;

  constructor(
    private http: HttpClient
  ) {
    this.header = this.header.append('Accept', 'application/json');
    this.header = this.header.append('Content-Type', 'application/json');
  }

  obtenerRoles(): Observable<IResponse> {
    let headers = this.header;
    return this.http.get<IResponse>(`${this.urlBase}/mantenimiento/roles`, { headers });
  }

  registrarRol(rol: IRoles): Observable<any> {
    let headers = this.header;
    return this.http.post(`${this.urlBase}/mantenimiento/roles`, rol, { headers });
  }

  actualizarRol(idRol: string, updatedRol: IRoles): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/roles/${idRol}`, updatedRol, { headers });
  }

  obtenerPermisosPorRol(idRol: string): Observable<IResponse> {
    let headers = this.header;
    return this.http.get<IResponse>(`${this.urlBase}/mantenimiento/permisos/roles/${idRol}`, { headers });
  }

  actualizarPermisosPorRol(updatedData: any): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/roles/permisos`, updatedData, { headers });
  }

  obtenerComponentes(): Observable<IResponse> {
    let headers = this.header;
    return this.http.get<IResponse>(`${this.urlBase}/mantenimiento/componentes`, { headers });
  }

  registrarComponente(componente: IComponentes): Observable<any> {
    let headers = this.header;
    return this.http.post(`${this.urlBase}/mantenimiento/componentes`, componente, { headers });
  }

  actualizarComponente(idComponente: string, updatedComponente: IComponentes): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/componentes/${idComponente}`, updatedComponente, { headers });
  }

  actualizarEstadoComponente(updateEstadoBody: IUpdateEstado): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/componentes/estado`, updateEstadoBody, { headers });
  }

  obtenerUsuarios(): Observable<IResponse> {
    let headers = this.header;
    return this.http.get<IResponse>(`${this.urlBase}/mantenimiento/usuarios`, { headers });
  }

  registrarUsuario(usuario: IUsuariosPersonas): Observable<any> {
    let headers = this.header;
    return this.http.post(`${this.urlBase}/mantenimiento/usuarios`, usuario, { headers });
  }

  actualizarUsuario(idUsuario: string, usuario: IUsuariosPersonas): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/usuarios/${idUsuario}`, usuario, { headers });
  }

  actualizarEstadoUsuario(updateEstadoBody: IUpdateEstado): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/usuarios/estado`, updateEstadoBody, { headers });
  }

  obtenerTiposRecibo(): Observable<IResponse> {
    let headers = this.header;
    return this.http.get<IResponse>(`${this.urlBase}/mantenimiento/tipos-recibo`, { headers });
  }

  registrarTipoRecibo(tipoRecibo: ITiposRecibo): Observable<any> {
    let headers = this.header;
    return this.http.post(`${this.urlBase}/mantenimiento/tipos-recibo`, tipoRecibo, { headers });
  }

  actualizarTipoRecibo(idTipoRecibo: string, tipoRecibo: ITiposRecibo): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/tipos-recibo/${idTipoRecibo}`, tipoRecibo, { headers });
  }

  obtenerRecibos(): Observable<IResponse> {
    let headers = this.header;
    return this.http.get<IResponse>(`${this.urlBase}/mantenimiento/recibos`, { headers });
  }

  registrarRecibo(data: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('crearReciboDTO', data.crearReciboDTO);
    formData.append('file', data.file);
    return this.http.post(`${this.urlBase}/mantenimiento/recibos`, formData);
  }

  actualizarRecibo(idRecibo: string, recibo: IRecibosUpdate): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/recibos/${idRecibo}`, recibo, { headers });
  }

  actualizarFileRecibo(idRecibo: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.put(`${this.urlBase}/mantenimiento/recibos/file/${idRecibo}`, formData);
  }

  obtenerInquilinos(): Observable<IResponse> {
    let headers = this.header;
    return this.http.get<IResponse>(`${this.urlBase}/mantenimiento/inquilinos/details`, { headers });
  }

  registrarInquilino(inquilino: IInquilinosPersonas): Observable<any> {
    let headers = this.header;
    return this.http.post(`${this.urlBase}/mantenimiento/inquilinos`, inquilino, { headers });
  }

  actualizarInquilino(idInquilino: string, inquilino: IInquilinosPersonas): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/inquilinos/${idInquilino}`, inquilino, { headers });
  }

  actualizarEstadoInquilino(updateEstadoBody: IUpdateEstado): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/inquilinos/estado`, updateEstadoBody, { headers });
  }

  obtenerLecturas(): Observable<IResponse> {
    let headers = this.header;
    return this.http.get<IResponse>(`${this.urlBase}/mantenimiento/lecturas/details`, { headers });
  }

  registrarLectura(lectura: ILecturaRegister): Observable<any> {
    let headers = this.header;
    return this.http.post(`${this.urlBase}/mantenimiento/lecturas`, lectura, { headers });
  }

  actualizarLectura(idLectura: string, updatedLectura: ILecturaUpdate): Observable<any> {
    let headers = this.header;
    return this.http.put(`${this.urlBase}/mantenimiento/lecturas/${idLectura}`, updatedLectura, { headers });
  }
}
