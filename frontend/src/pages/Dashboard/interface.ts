import { Response } from "../../common/reponse";

export interface SubItem {
  createdAt?: string;
  deletedAt?: string | null;
  id?: string;
  name?: string;
  parent_id?: string;
  path?: string;
  size?: number;
  type?: string | "folder" | "file";
  updatedAt?: string;
  user_id?: string;
}

export interface GetAllRootResponse extends Response {
  result?: SubItem[];
}

export interface GetCreateResponse extends Response {
  result?: SubItem;
}
