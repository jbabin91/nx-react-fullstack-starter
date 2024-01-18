export const envConfig: {
  port: number;
  origin: string;
  env: 'development' | 'test' | 'production';
} = {
  env: process.env['NODE_ENV'] as 'development' | 'test' | 'production',
  origin: process.env['BACKEND_ORIGIN'] || 'http://localhost:4200',
  port: process.env['PORT'] ? Number.parseInt(process.env['PORT'], 10) : 3333,
};
