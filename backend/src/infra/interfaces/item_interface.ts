export interface IItemDocument {
  id?: string;
  user_id?: string;
  parent_id?: string | null;
  name?: string;
  type?: string;
  size?: number;
  path?: string;
  virtual_path?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
