

//import mysql from 'mysql2/promise';
import pg from 'pg';

import dotenv from 'dotenv';
import { env } from 'node:process';

dotenv.config();

const { Pool } = pg;

const connectionString = `postgresql://${env.DATABASE_USERNAME}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`;
 
const pool = new Pool({
  connectionString,
})

export default pool;