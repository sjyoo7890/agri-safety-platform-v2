import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'agri_user',
  password: process.env.DB_PASSWORD || 'agri_pass_dev',
  database: process.env.DB_DATABASE || 'agri_safety',
}));
