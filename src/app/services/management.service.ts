import { Injectable } from '@angular/core';
import { IConsumption, IConsumptionFilterParams, IConsumptionPOST } from '../interfaces/IConsumption.interface';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAPIResponseListGET, IAPIResponseGET, IAPIResponsePOST } from '../interfaces/IApiResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  readonly baseURL: string = environment.baseURL;

  constructor(
    private readonly http: HttpClient
  ) { }

  /* CONSUMPTIONS */
  fetchConsumptions(filterParams: IConsumptionFilterParams): Observable<IAPIResponseListGET<IConsumption>> {
    let queryParams = new HttpParams();
    const filteredParams = filterParams as Partial<IConsumptionFilterParams>;
    Object.keys(filteredParams).forEach((key) => {
      const value = filteredParams[key as keyof IConsumptionFilterParams];
      if (value !== undefined) queryParams = queryParams.set(key, value.toString());
    });
    return this.http.get<IAPIResponseListGET<IConsumption>>(`${this.baseURL}/consumptions`, { params: queryParams })
      .pipe(
        map((consumptionListPayload: IAPIResponseListGET<IConsumption>) => {
          return {
            ...consumptionListPayload,
            message: 'Consumos obtenidos correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent) {
            messageError = 'Servicio de consulta de consumos no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  fetchConsumptionById(consumptionId: string): Observable<IAPIResponseGET<IConsumption>> {
    return this.http.get<IAPIResponseGET<IConsumption>>(`${this.baseURL}/consumptions/${consumptionId}`)
      .pipe(
        map((consumptionPayload: IAPIResponseGET<IConsumption>) => {
          return {
            ...consumptionPayload,
            message: 'Consumo obtenido correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent) {
            messageError = 'Servicio de consulta de consumo por id no disponible.';
          } else if (!error.ok && 'message' in error.error) {
            messageError = error.error.message;
          } else {
            messageError = 'Error de sistema. Inténtelo más tarde.';
          }
          throw new Error(messageError);
        })
      );
  }

  registerConsumption(consumptionBody: IConsumptionPOST): Observable<IAPIResponseGET<IConsumption>> {
    return this.http.post<IAPIResponseGET<IConsumption>>(`${this.baseURL}/consumptions`, consumptionBody)
      .pipe(
        map((consumptionPayload: IAPIResponsePOST<IConsumption>) => {
          return {
            ...consumptionPayload,
            message: 'Consumo registrado correctamente.'
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let messageError = '';
          if (error.error instanceof ProgressEvent) {
            messageError = 'Servicio de registro de consumo no disponible.';
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
