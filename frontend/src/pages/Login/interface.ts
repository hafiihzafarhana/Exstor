import { Response } from "../../common/reponse";

export interface LoginResponse extends Response {
  result?: {
    id: string;
    username: string;
    email: string;
    root_id: string;
  };
}
