import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1630400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Creating users table...');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        refreshtoken VARCHAR(255)
      );
    `);
    console.log('Users table created successfully.');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Dropping users table...');
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    console.log('Users table dropped successfully.');
  }
}
