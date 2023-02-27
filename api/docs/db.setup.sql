CREATE TABLE IF NOT EXISTS users (
	id serial NOT NULL PRIMARY KEY,
	data json NOT NULL
);

CREATE TABLE IF NOT EXISTS monster_summaries (
	id serial NOT NULL PRIMARY KEY,
	data json NOT NULL
);

CREATE TABLE IF NOT EXISTS monster_parts (
	id serial NOT NULL PRIMARY KEY,
	data json NOT NULL
);

CREATE TABLE IF NOT EXISTS monster_palettes (
	id serial NOT NULL PRIMARY KEY,
	data json NOT NULL
);