export interface IUserDocument {
  id?: string;
  email?: string;
  password?: string;
  name?: string;
  username?: string;
  item_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  checkPassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}
