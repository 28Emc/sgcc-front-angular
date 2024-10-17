import { IArea } from "./IArea.interface";
import { IService } from "./IService.interface";
import { IUser } from "./IUser.interface";

export interface IConsumption {
  id: number;
  readingDate: string;
  user: IUser;
  service: IService;
  area: IArea;
  previousReading: number;
  currentReading: number;
  calculatedConsumption: number;
  unitPrice: number;
  totalAmount: number;
  billAmount: number;
  observations?: string;
}

export interface IConsumptionFilterParams {
  user?: number;
  service?: number;
  area?: number;
}

export interface IConsumptionPOST {
  userId: number;
  serviceId: number;
  areaId: number;
  previousReading: number;
  currentReading: number;
  unitPrice: number;
  billAmount: number;
  observations?: string;
}
