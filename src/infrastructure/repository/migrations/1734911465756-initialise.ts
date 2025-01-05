import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialise1734911465756 implements MigrationInterface {
    name = 'Initialise1734911465756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_event" ("id" SERIAL NOT NULL, "userId" integer, "eventId" integer, CONSTRAINT "PK_4245a6b002b13f12e426d9db3ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TYPE "public"."user_authtype_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "password" text, "firstName" text NOT NULL, "lastName" text NOT NULL, "role" "public"."user_role_enum", "authType" "public"."user_authtype_enum" NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "updatedById" integer, CONSTRAINT "UQ_ed00bef8184efd998af767e89b8" UNIQUE ("email", "role"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "description" text NOT NULL, "location" jsonb, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdById" integer, "updatedById" integer, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_event" ADD CONSTRAINT "FK_77452fe8443c349b0e628507cbb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_event" ADD CONSTRAINT "FK_6a41d7c0f21abb37cd273824fa6" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_db5173f7d27aa8a98a9fe6113df" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_1d5a6b5f38273d74f192ae552a6" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_ebd5032c5bc4ca401d847db089a" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_ebd5032c5bc4ca401d847db089a"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_1d5a6b5f38273d74f192ae552a6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_db5173f7d27aa8a98a9fe6113df"`);
        await queryRunner.query(`ALTER TABLE "user_event" DROP CONSTRAINT "FK_6a41d7c0f21abb37cd273824fa6"`);
        await queryRunner.query(`ALTER TABLE "user_event" DROP CONSTRAINT "FK_77452fe8443c349b0e628507cbb"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_authtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_event"`);
    }

}
