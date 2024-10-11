export interface IUser {
  id: number;
  username: string;
  alias: string;
  rol: string;
  rol_id?: number;
  avatar?: string;
  state?: string;

  token?: string;
  refresh_token?: string;
}

export interface IUserLoginReq {
  username: string;
  password: string;
}

export interface IUserLogoutReq {
  user_id: string;
}
