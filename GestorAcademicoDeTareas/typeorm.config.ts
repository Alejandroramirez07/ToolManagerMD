// Archivo para desarrollo
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port:  Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // entities: [User, Products], // Llamamos las entidades para crear las migraciones
    migrations: ['./src/migrations/*.ts'] // Llamamos la migraciones
});