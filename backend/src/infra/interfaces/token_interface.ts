export interface ITokenDocument {
  user_id?: string;
  acc_token?: string;
  ref_token?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ITokenPayload {
  email?: string;
  user_id?: string;
  iat?: number;
  exp?: number;
  acc_token?: string;
}
