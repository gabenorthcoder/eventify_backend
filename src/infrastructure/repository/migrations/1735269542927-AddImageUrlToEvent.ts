import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToEvent1735269542927 implements MigrationInterface {
    name = 'AddImageUrlToEvent1735269542927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "imageUrl" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "imageUrl"`);
    }

}
