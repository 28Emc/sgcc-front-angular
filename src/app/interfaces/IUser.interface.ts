export interface IUser {
  id: number;
  username: string;
  alias: string;
  rol_id?: number;
  rol: string;
  avatar?: string;
  state?: string;

  token?: string;
  refresh_token?: string;
}
