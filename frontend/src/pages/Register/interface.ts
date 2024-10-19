import { Response } from "../../common/reponse";

export interface RegisterResponse extends Response {
  result?: {
    id: string;
    username: string;
    email: string;
    root_id: string;
  };
}
