export const createAllTables = `

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  firstname VARCHAR(50) DEFAULT '',
  lastname VARCHAR(50) DEFAULT '',
  password VARCHAR DEFAULT ''
  );
`;
export const dropAllTables = `
DROP TABLE users;
`;

export const insertIntoAllTables = `
INSERT INTO users (email, password, firstname, lastname) VALUES ('test user', 'testpassword', 'test', 'user');
