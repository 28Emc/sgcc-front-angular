import { ILogout } from './../../models/ILogout.interface';
import { Observable, BehaviorSubject, of, delay, tap } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ILogin } from 'src/app/models/ILogin.interface';

import fakeData from '../../utils/fake-data.json';
import { IUpdateProfile } from 'src/app/models/IUpdateProfile.interface';
import { IRestorePassword } from 'src/app/models/IRestorePassword.interface';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private _creditoGestor$: BehaviorSubject<number>;
  creditosGestor$: Observable<number>;
  header: HttpHeaders;
  jwt: string = '';
  readonly urlBase: string = environment.rutaBase;
  fakeUserPersona = fakeData.fakeUserPersona;
  fakePermisos = fakeData.fakePermisos;
  fakeSesion = fakeData.fakeSesion;

  constructor(
    private http: HttpClient
  ) {
    this.header = new HttpHeaders();
    this.header = this.header.append('Accept', 'application/json');
    this.header = this.header.append("Content-Type", "application/json");
    // this.header = this.header.append("Authorization", environment.secretKey);

    this._creditoGestor$ = new BehaviorSubject<number>(null);
    this.creditosGestor$ = this._creditoGestor$.asObservable();
  }

  actualizarCreditosGestor(creditosGestor: number): void {
    this._creditoGestor$.next(creditosGestor);
  }

  almacenarInfoUsuarioSessionStorage(data: any): void {
    let user = (data.user.persona) ? data.user : this.fakeUserPersona;
    let permisos = data.permisos ?? this.fakePermisos;
    let sesion = data.sesion ?? this.fakeSesion;
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('perm', JSON.stringify(permisos));
    sessionStorage.setItem('ss', JSON.stringify(sesion));
  }

  almacenarTokens(token: string, refreshToken: string): void {
    sessionStorage.setItem('tkn', token);
    sessionStorage.setItem('r-tkn', refreshToken);
  }

  obtenerAccessToken(): string {
    return sessionStorage.getItem('tkn');
  }

  obtenerRefreshToken(): string {
    return sessionStorage.getItem('r-tkn');
  }

  borrarTokens(): void {
    sessionStorage.removeItem('tkn');
    sessionStorage.removeItem('r-tkn');
  }

  obtenerInfoUsuarioSessionStorage(): any {
    return JSON.parse(sessionStorage.getItem('user')) ?? this.fakeUserPersona;
  }

  obtenerInfoPermisosSessionStorage(): any {
    return JSON.parse(sessionStorage.getItem('perm')) ?? this.fakePermisos;
  }

  obtenerInfoSesionSessionStorage(): any {
    return JSON.parse(sessionStorage.getItem('ss')) ?? this.fakeSesion;
  }

  actualizarPasswordUser(idUsuario: string, data: any): Observable<any> {
    return of({ idUsuario, data });

    // FIXME: INTEGRAR CON BACKEND
    /* let headers = this.header;
    return this.http.put(`${this.urlBase}/usuarios/${idUsuario}/password-user`, data, { headers }); */
  }

  actualizarPasswordAdmin(idUsuario: string, data: any): Observable<any> {
    return of({ idUsuario, data });

    // FIXME: INTEGRAR CON BACKEND
    /* let headers = this.header;
    return this.http.put(`${this.urlBase}/usuarios/${idUsuario}/password-admin`, data, { headers }); */
  }

  actualizarDatosPerfil(dataUpdateProfile: IUpdateProfile): Observable<any> {
    return of(dataUpdateProfile).pipe(delay(1500));

    // FIXME: INTEGRAR CON BACKEND
    /*
    let headers = this.header;
    return this.http.put(`${this.urlBase}/auth/profile`, dataUpdateProfile, { headers });
    */
  }

  enviarSolicitudRecuperacionPassword(dataRestorePassword: IRestorePassword): Observable<any> {
    return of(dataRestorePassword).pipe(delay(1500));

    // FIXME: INTEGRAR CON BACKEND
    /*
    let headers = this.header;
    return this.http.post(`${this.urlBase}/auth/forgot-password`, dataRestorePassword, { headers });
    */
  }

  login(dataLogin: ILogin): Observable<any> {
    let headers = this.header;
    headers = headers.delete('Content-Type');
    const form: FormData = new FormData();
    form.append('usuario', dataLogin.usuario);
    form.append('password', dataLogin.password);
    return this.http.post(`${this.urlBase}/auth/login`, form, { headers });
  }

  getAdditionalUserInfo(usuario: string): Observable<any> {
    let headers = this.header;
    return this.http.get(`${this.urlBase}/auth/additional-info/${usuario}`, { headers });
  }

  refreshToken(): Observable<any> {
    let headers = this.header;
    headers = headers.set('Authorization', 'Bearer ' + this.obtenerRefreshToken());
    return this.http.post(`${this.urlBase}/auth/token/refresh`, null, { headers })
      .pipe(tap((resToken: any) => this.almacenarTokens(resToken.accessToken, resToken.refreshToken)));
  }

  cerrarSesión(dataLogout: ILogout): Observable<any> {
    this.borrarTokens();
    return of(dataLogout);
  }
}
