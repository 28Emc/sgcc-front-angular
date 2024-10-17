import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAPIResponseGET, IAPIResponseListGET, IAPIResponsePOST, IAPIResponsePUT } from '../interfaces/IApiResponse.interface';
import { IArea } from '../interfaces/IArea.interface';
import { IService } from '../interfaces/IService.interface';
import { IUser } from '../interfaces/IUser.interface';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  readonly baseURL: string = environment.baseURL;

  constructor(
    private readonly http: HttpClient
  ) { }

  /* USERS */
  fetchUsers(): Observable<IAPIResponseListGET<IUser>> {
    return this.http.get<IAPIResponseListGET<IUser>>(`${this.baseURL}/users`)
      .pipe(
        map((userListPayload: IAPIResponseListGET<IUser>) => {
          return {
            data: userListPayload.data,
            message: 'Usuarios obtenidos correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.log('error', error)
          let messageError: string;
          if (error.error instanceof ProgressEvent || (!error.ok && [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status))) {
            messageError = 'Servicio de consulta de usuarios no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  fetchUserById(userId: string): Observable<IAPIResponseGET<IUser>> {
    return this.http.get<IAPIResponseGET<IUser>>(`${this.baseURL}/users/${userId}`)
      .pipe(
        map((userPayload: IAPIResponseGET<IUser>) => {
          return {
            data: userPayload.data,
            message: 'Usuario obtenido correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent || (!error.ok && [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status))) {
            messageError = 'Servicio de consulta de usuario por id no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  registerUserData(userData: any): Observable<IAPIResponsePOST<IUser>> {
    return this.http.post<IAPIResponsePOST<IUser>>(`${this.baseURL}/users`, userData)
      .pipe(
        map((userPayload: IAPIResponsePOST<IUser>) => {
          return {
            data: userPayload.data,
            message: 'Usuario registrado correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent || (!error.ok && [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status))) {
            messageError = 'Servicio de registro de usuario no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  updateUserData(userId: number, userData: any): Observable<IAPIResponsePUT<IUser>> {
    return this.http.put<IAPIResponsePUT<IUser>>(`${this.baseURL}/users/${userId}`, userData)
      .pipe(
        map((userPayload: IAPIResponsePUT<IUser>) => {
          return {
            data: userPayload.data,
            message: 'Datos del usuario actualizados correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent || (!error.ok && [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status))) {
            messageError = 'Servicio de actualización de datos del usuario no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  deleteUserData(userId: number): Observable<IAPIResponsePUT<IUser>> {
    return this.http.delete<IAPIResponsePUT<IUser>>(`${this.baseURL}/users/${userId}`)
      .pipe(
        map((userPayload: IAPIResponsePUT<IUser>) => {
          return {
            data: userPayload.data,
            message: 'Usuario dado de baja correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent || (!error.ok && [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status))) {
            messageError = 'Servicio de eliminación de datos del usuario no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  /* AREAS */
  fetchAreas(): Observable<IAPIResponseListGET<IArea>> {
    return this.http.get<IAPIResponseListGET<IArea>>(`${this.baseURL}/areas`)
      .pipe(
        map((areaListPayload: IAPIResponseListGET<IArea>) => {
          return {
            data: areaListPayload.data,
            message: 'Áreas obtenidas correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent || (!error.ok && [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status))) {
            messageError = 'Servicio de consulta de áreas no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  fetchAreaById(areaId: string): Observable<IAPIResponseGET<IArea>> {
    return this.http.get<IAPIResponseGET<IArea>>(`${this.baseURL}/areas/${areaId}`)
      .pipe(
        map((areaPayload: IAPIResponseGET<IArea>) => {
          return {
            data: areaPayload.data,
            message: 'Área obtenida correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent || (!error.ok && [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status))) {
            messageError = 'Servicio de consulta de área por id no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  /*  SERVICES */
  fetchServices(): Observable<IAPIResponseListGET<IService>> {
    return this.http.get<IAPIResponseListGET<IService>>(`${this.baseURL}/services`)
      .pipe(
        map((serviceListPayload: IAPIResponseListGET<IService>) => {
          return {
            data: serviceListPayload.data,
            message: 'Servicios obtenidos correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent || (!error.ok && [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status))) {
            messageError = 'Servicio de consulta de servicios no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  fetchServiceById(serviceId: string): Observable<IAPIResponseGET<IService>> {
    return this.http.get<IAPIResponseGET<IService>>(`${this.baseURL}/services/${serviceId}`)
      .pipe(
        map((servicePayload: IAPIResponseGET<IService>) => {
          return {
            data: servicePayload.data,
            message: 'Servicio obtenido correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent || (!error.ok && [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status))) {
            messageError = 'Servicio de consulta de servicio por id no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }
}
