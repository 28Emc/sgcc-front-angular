import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NavigationLoaderService } from '../core/navigation/navigation-loader.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, delay, of } from 'rxjs';
import { NavigationDropdown, NavigationItem, NavigationLink } from '../core/navigation/navigation-item.interface';

import { IUser, IUserLoginReq, IUserLogoutReq } from '../interfaces/IUser.interface';
import { fakeUserLogin, OPTIONS } from '../utils/fake-data';
import { encryptPassword } from '../utils/utilFunctions';
import { VexColorScheme } from '@vex/config/vex-config.interface';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  readonly baseURL: string = environment.baseURL;
  navigationLoaderService = inject(NavigationLoaderService);

  constructor(
    private readonly http: HttpClient
  ) { }

  // TODO: INTEGRAR SERVICIO REAL
  login(loginData: IUserLoginReq): Observable<any> {
    loginData.password = encryptPassword(loginData.password);
    // return this.http.post<any>(`${this.baseURL}/auth/login`, loginData)
    return of(fakeUserLogin)
      .pipe(
        delay(1000),
        map((loginPayload: IUser) => {
          return {
            status: 'OK',
            message: 'Inicio de sesión correcto.',
            data: {
              user: {
                id: loginPayload.id,
                alias: loginPayload.alias,
                username: loginPayload.username,
                rol: loginPayload.rol,
                avatar: loginPayload.avatar ?? 'https://picsum.photos/200.webp'
              } as IUser,
              token: loginPayload.token ?? 'ec80f5690620d23ab137502f24165195009d9466',
              refresh_token: loginPayload.refresh_token ?? 'ec80f5690620d23ab137502f24165195009d9466',
              options: OPTIONS
            }
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent) {
            messageError = 'Servicio de inicio de sesión no disponible';
          } else if ('status' in error.error && ['NOT_FOUND', 'BAD_REQUEST'].includes(error.error.status)) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema';
          }
          throw new Error(messageError);
        })
      );
  }

  // TODO: INTEGRAR SERVICIO REAL
  refreshToken(): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/jwt/refresh`, null)
      .pipe(
        map((refreshJwtPayload: any) => {
          return {
            message: 'JWT has been refreshed successfully.',
            details: refreshJwtPayload
          }
        })
      );
  }

  // TODO: INTEGRAR SERVICIO REAL
  signOut(logoutData: IUserLogoutReq): Observable<any> {
    this.clearSessionStorageData();
    return of({
      message: 'User logged out successfully.',
      details: logoutData
    }).pipe(delay(500));
  }

  isUserLoggedIn(): Observable<string | null> {
    return of(sessionStorage.getItem('tkn'));
  }

  storeUserData(userInfo: IUser): void {
    sessionStorage.setItem('user', JSON.stringify(userInfo));
  }

  storeTokenData(token: string, refreshToken?: string): void {
    sessionStorage.setItem('tkn', token);
    if (refreshToken) sessionStorage.setItem('r-tkn', refreshToken);
  }

  storeSystemOptions(options: any[]): void {
    this.navigationLoaderService.loadNavigation(options);
    sessionStorage.setItem('opts', JSON.stringify(options));

    //? V2
    // const opcionesSistema = this._reorderComponents(options);
    // this.navigationLoaderService.loadNavigation(opcionesSistema);
    // sessionStorage.setItem('opts', JSON.stringify(opcionesSistema));
  }

  clearSessionStorageData(): void {
    const colorScheme: VexColorScheme = sessionStorage.getItem('colorScheme') as VexColorScheme ?? VexColorScheme.LIGHT;
    sessionStorage.clear();
    sessionStorage.setItem('colorScheme', colorScheme);
  }

  private _reorderComponents(optiones: any[]): any[] {
    let tempArray: any[] = [];
    optiones.forEach((c: any, i: number) => {
      if (c.url && c.url !== '') {
        let padreLink: NavigationLink = {} as NavigationLink;
        padreLink.type = 'link';
        padreLink.label = c.nombre;
        padreLink.icon = c.icono;
        padreLink.id_componente = c.id;
        padreLink.id_componente_padre = c.parentId;
        padreLink.route = c.url;
        padreLink.orden = c.orden ? +c.orden : i + 1;
        tempArray.push(padreLink);
      } else {
        let padreDropdown: NavigationDropdown = {} as NavigationDropdown;
        padreDropdown.type = 'dropdown';
        padreDropdown.label = c.nombre;
        padreDropdown.icon = c.icono;
        padreDropdown.id_componente = c.id;
        padreDropdown.id_componente_padre = c.parentId;
        padreDropdown.orden = c.orden ? +c.orden : i + 1;
        padreDropdown.children = [];
        tempArray.push(padreDropdown);
      }
      i++;
    });
    tempArray.sort((a, b) => a.orden - b.orden);
    return this._groupComponents(tempArray);
  }

  private _groupComponents(componentes: any[]): any[] {
    let dictionary: any = {};
    componentes.forEach(com => {
      if (!dictionary[com.id_componente_padre]) {
        dictionary[com.id_componente_padre] = [];
      }
      dictionary[com.id_componente_padre].push(com);
    });
    return this._groupComponentsHierarchically(dictionary);
  }

  private _groupComponentsHierarchically(dictionary: any, parentId: any = '0'): NavigationItem[] {
    let result: any = [];
    if (dictionary[parentId]) {
      dictionary[parentId].forEach((com: any) => {
        let children = dictionary[com.id_componente] ? this._groupComponentsHierarchically(dictionary, com.id_componente) : [];
        result.push({ ...com, children });
      });
    }
    return result;
  }
}
