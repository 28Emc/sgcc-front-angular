export interface IAPIResponseGET<T> {
  message: string;
  data: T;
}

export interface IAPIResponseListGET<T> {
  message: string;
  data: T[];
}

export interface IAPIResponsePOST<T> {
  message: string;
  data: T;
}

export interface IAPIResponseListPOST<T> {
  message: string;
  data: T[];
}

export interface IAPIResponsePUT<T> {
  message: string;
  data: T;
}

export interface IAPIResponseListPUT<T> {
  message: string;
  data: T[];
}
