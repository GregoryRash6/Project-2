CREATE TABLE spotify (
    id SERIAL PRIMARY KEY,
    "position" INT,
    "track_name" VARCHAR,
	"artist" VARCHAR,
	"streams" INT,
	"url" VARCHAR,
	"date" VARCHAR,
	"region" VARCHAR
);