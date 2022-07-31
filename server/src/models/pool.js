import { Pool } from 'pg';
import { production, connectionString } from '../settings';

export const pool = production === 'true'
  ? new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new Pool({ connectionString });
