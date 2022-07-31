import { pool } from '../models/pool';
import { createAllTables, dropAllTables, insertIntoAllTables } from './queries';

export const executeQueryArray = async (arr) => new Promise((resolve) => {
  const stop = arr.length;
  arr.forEach(async (q, index) => {
    await pool.query(q);
    if (index + 1 === stop) resolve();
  });
});

export const createTables = () => executeQueryArray([ createAllTables ]);
export const dropTables = () => executeQueryArray([ dropAllTables ]);
export const insertIntoTables = () => executeQueryArray([ insertIntoAllTables ]);
