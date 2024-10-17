import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NavigationLoaderService } from '../core/navigation/navigation-loader.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, of, tap, shareReplay, BehaviorSubject } from 'rxjs';
import { NavigationDropdown, NavigationItem, NavigationLink } from '../core/navigation/navigation-item.interface';

import { IUser, IUserLoginReq, IUserLoginRes, IUserLogoutReq } from '../interfaces/IUser.interface';
import { OPTIONS } from '../utils/fake-data';
import { VexColorScheme } from '@vex/config/vex-config.interface';
import { IAPIResponsePOST } from '../interfaces/IApiResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  readonly baseURL: string = environment.baseURL;
  navigationLoaderService = inject(NavigationLoaderService);

  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  accessTokenStr = '';
  refreshTokenStr = '';
  isRefreshingToken = false;

  constructor(
    private readonly http: HttpClient
  ) { }

  login(loginData: IUserLoginReq): Observable<IAPIResponsePOST<IUserLoginRes>> {
    return this.http.post<IAPIResponsePOST<IUserLoginRes>>(`${this.baseURL}/auth/login`, loginData)
      .pipe(
        map((loginPayload: IAPIResponsePOST<IUserLoginRes>) => {
          return {
            message: 'Inicio de sesión correcto.',
            data: {
              ...loginPayload.data,
              user: {
                ...loginPayload.data.user,
                avatar: loginPayload.data.user.avatar ?? 'https://picsum.photos/200.webp'
              } as IUser,
              options: OPTIONS
            }
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent) {
            messageError = 'Servicio de inicio de sesión no disponible.';
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  getAccessToken(): string {
    return this.accessTokenStr || (sessionStorage.getItem('tkn') ?? '');
  }

  getRefreshToken(): string {
    return this.refreshTokenStr || (sessionStorage.getItem('r-tkn') ?? '');
  }

  refreshToken(): Observable<any> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      return this.http.post<IAPIResponsePOST<any>>(`${this.baseURL}/auth/refresh-token`, { refreshToken: this.getRefreshToken() })
        .pipe(
          tap((refreshJwtPayload: IAPIResponsePOST<any>) => {
            this.storeTokenData(refreshJwtPayload.data.accessToken, refreshJwtPayload.data.refreshToken);
            this.refreshTokenSubject.next(refreshJwtPayload.data.accessToken);
            this.isRefreshingToken = false;
          }),
          catchError(_err => {
            this.isRefreshingToken = false;
            this.refreshTokenSubject.next(null);
            return of(null);
          }),
          shareReplay(1)
        );
    } else {
      return this.refreshTokenSubject.asObservable();
    }
  }

  signOut(logoutData: IUserLogoutReq): Observable<any> {
    this.clearSessionStorageData();
    this.accessTokenStr = '';
    this.refreshTokenStr = '';
    return of({
      message: 'Cierre de sesión correcto.',
      details: logoutData
    });
  }

  isUserLoggedIn(): Observable<string | null> {
    return of(sessionStorage.getItem('tkn'));
  }

  storeUserData(userInfo: IUser): void {
    sessionStorage.setItem('user', JSON.stringify(userInfo));
  }

  storeTokenData(token: string, refreshToken?: string): void {
    this.accessTokenStr = token;
    sessionStorage.setItem('tkn', token);
    if (refreshToken) {
      this.refreshTokenStr = refreshToken;
      sessionStorage.setItem('r-tkn', refreshToken);
    }
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
