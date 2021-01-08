CREATE TABLE "shark_attacks" (
    "case_number" VARCHAR PRIMARY KEY NOT NULL,
    "date" VARCHAR   NOT NULL,
    "year" INT   NOT NULL,
    "type" VARCHAR   NOT NULL,
    "country" VARCHAR   NOT NULL,
    "area" VARCHAR   NOT NULL,
    "location" VARCHAR   NOT NULL,
    "activity" VARCHAR   NOT NULL,
    "name" VARCHAR   NOT NULL,
    "sex" VARCHAR(1)   NOT NULL,
    "age" VARCHAR   NOT NULL,
    "injury" VARCHAR   NOT NULL,
    "fatal" VARCHAR(1)   NOT NULL,
    "time" VARCHAR   NOT NULL,
    "species" VARCHAR   NOT NULL,
    "source" VARCHAR   NOT NULL
);

CREATE TABLE "pdf_scape" (
    "case_number" VARCHAR   NOT NULL,
    "moonphase" VARCHAR   NOT NULL,
    CONSTRAINT "pk_pdf_scape" PRIMARY KEY (
        "case_number"
     )
);

ALTER TABLE "shark_attacks" ADD CONSTRAINT "fk_shark_attacks_case_number" FOREIGN KEY("case_number")
REFERENCES "pdf_scape" ("case_number");