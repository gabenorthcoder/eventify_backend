import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddresstoEvents1735431087724 implements MigrationInterface {
    name = 'AddAddresstoEvents1735431087724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" RENAME COLUMN "location" TO "address"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "address" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "address" jsonb`);
        await queryRunner.query(`ALTER TABLE "event" RENAME COLUMN "address" TO "location"`);
    }

}
