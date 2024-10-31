export interface IUser {
  id: number;
  username: string;
  password?: string;
  alias: string;
  role: string;
  createdAt: string;
  rol_id?: number;
  avatar?: string;
  state?: string;

  accessToken?: string;
  refreshToken?: string;
}

export type CrudUser = IUser & { acciones: string };

export interface IUserLoginReq {
  username: string;
  password: string;
}

export interface IUserLoginRes {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  options: any[];
}

export interface IUserLogoutReq {
  user_id: string;
}
