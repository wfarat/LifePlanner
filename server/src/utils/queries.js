export const createAllTables = `
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS day_tasks;
DROP TABLE IF EXISTS day_notes;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS days;
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  firstname VARCHAR(50) DEFAULT '',
  lastname VARCHAR(50) DEFAULT '',
  password VARCHAR DEFAULT ''
);
CREATE TABLE IF NOT EXISTS days (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  day_ref INT NOT NULL,
  user_id INT NOT NULL,
  comment VARCHAR NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS goals (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR NOT NULL,
  user_id INT NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  edited TIMESTAMPTZ NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id INT NOT NULL,
  repeat VARCHAR(50) DEFAULT '',
  name VARCHAR(100) NOT NULL,
  duration INT,
  description VARCHAR NOT NULL,
  goal_id INT,
  FOREIGN KEY (goal_id) REFERENCES goals(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS day_notes (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  day_id INT NOT NULL,
  title VARCHAR(100) DEFAULT '',
  content VARCHAR NOT NULL,
  FOREIGN KEY (day_id) REFERENCES days(id)
);
CREATE TABLE IF NOT EXISTS day_tasks (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  day_id INT NOT NULL,
  task_id INT NOT NULL,
  start INT,
  finish INT,
  comment VARCHAR(100) DEFAULT '',
  FOREIGN KEY (day_id) REFERENCES days(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
CREATE TABLE IF NOT EXISTS notes (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
  title VARCHAR(100) DEFAULT '',
  content VARCHAR NOT NULL,
  user_id INT NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  edited TIMESTAMPTZ NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;
export const dropAllTables = `
DROP TABLE notes;
DROP TABLE day_tasks;
DROP TABLE day_notes;
DROP TABLE tasks;
DROP TABLE goals;
DROP TABLE days;
DROP TABLE users;
`;

export const insertIntoAllTables = `
INSERT INTO users (email, password, firstname, lastname) VALUES ('test user', 'testpassword', 'test', 'user');
INSERT INTO days (day_ref, user_id, comment) VALUES (111990, 1, 'this day was cool');
INSERT INTO tasks (name, description, user_id) VALUES ('unga bunga', 'good task', 1);
INSERT INTO day_tasks (day_id, task_id) VALUES (1, 1);
INSERT INTO day_notes (day_id, content) VALUES (1, 'blah blah');
`;
