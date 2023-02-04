CREATE TABLE tasks (
	id serial PRIMARY KEY,
	title VARCHAR ( 250 ) NOT NULL,
	completed boolean DEFAULT false
)