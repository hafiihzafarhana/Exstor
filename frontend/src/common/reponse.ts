export interface Response {
  msg?: string;
  status?: number;
  token?: string;
}

export interface CustomError {
  message: string;
  status?: number; 
  statusCode?: number; 
  comingFrom?: string; 
}
