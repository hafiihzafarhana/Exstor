import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

// Config .env
class ConfigData {
  public TODO_NODE_ENV: string | undefined;
  public TODO_CLIENT_URL: string | undefined;
  public TODO_CLOUDINARY_NAME: string | undefined;
  public TODO_CLOUDINARY_API_KEY: string | undefined;
  public TODO_CLOUDINARY_API_SECRET: string | undefined;
  public TODO_DATABASE_HOST: string | undefined;
  public TODO_DATABASE_USER: string | undefined;
  public TODO_DATABASE_PASSWORD: string | undefined;
  public TODO_DATABASE_NAME: string | undefined;
  public TODO_CLUSTER_TYPE: string | undefined;

  public TODO_ACCESS_TOKEN_SECRET: string | undefined;
  public TODO_REFRESH_TOKEN_SECRET: string | undefined;
  public TODO_ACCESS_TOKEN_TIME: string | undefined;
  public TODO_REFRESH_TOKEN_TIME: string | undefined;

  constructor() {
    this.TODO_NODE_ENV = process.env.TODO_NODE_ENV || '';
    this.TODO_CLIENT_URL = process.env.TODO_CLIENT_URL || '';
    this.TODO_CLOUDINARY_NAME = process.env.TODO_CLOUDINARY_NAME || '';
    this.TODO_CLOUDINARY_API_KEY = process.env.TODO_CLOUDINARY_API_KEY || '';
    this.TODO_CLOUDINARY_API_SECRET = process.env.TODO_CLOUDINARY_API_SECRET || '';
    this.TODO_DATABASE_HOST = process.env.TODO_DATABASE_HOST || '';
    this.TODO_DATABASE_USER = process.env.TODO_DATABASE_USER || '';
    this.TODO_DATABASE_PASSWORD = process.env.TODO_DATABASE_PASSWORD || '';
    this.TODO_DATABASE_NAME = process.env.TODO_DATABASE_NAME || '';
    this.TODO_CLUSTER_TYPE = process.env.TODO_CLUSTER_TYPE || '';

    this.TODO_ACCESS_TOKEN_SECRET = process.env.TODO_ACCESS_TOKEN_SECRET || '';
    this.TODO_REFRESH_TOKEN_SECRET = process.env.TODO_REFRESH_TOKEN_SECRET || '';
    this.TODO_ACCESS_TOKEN_TIME = process.env.TODO_ACCESS_TOKEN_TIME || '';
    this.TODO_REFRESH_TOKEN_TIME = process.env.TODO_REFRESH_TOKEN_TIME || '';
  }
}

export const todoConfig: ConfigData = new ConfigData();

export async function cloudinaryConfig(): Promise<void> {
  cloudinary.v2.config({
    cloud_name: todoConfig.TODO_CLOUDINARY_NAME,
    api_key: todoConfig.TODO_CLOUDINARY_API_KEY,
    api_secret: todoConfig.TODO_CLOUDINARY_API_SECRET
  });
  await checkCloudinary();
}

export async function checkCloudinary(): Promise<void> {
  try {
    const result = await cloudinary.v2.api.ping();
    if (result.status === 'ok') {
      console.log('Cloudinary connection successful');
    } else {
      console.log('Cloudinary connection failed');
    }
  } catch (error) {
    console.error('Cloudinary connection failed:', error);
  }
}
