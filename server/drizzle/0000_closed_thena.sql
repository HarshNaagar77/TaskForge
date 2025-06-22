CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"firebase_uid" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now()
);
