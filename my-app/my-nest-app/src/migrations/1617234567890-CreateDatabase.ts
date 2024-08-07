import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1617234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const databaseName = 'ip_cameras_db';
    const query = `SELECT 1 FROM pg_database WHERE datname = '${databaseName}'`;
    const result = await queryRunner.query(query);

    if (result.length === 0) {
      await queryRunner.query(`CREATE DATABASE ${databaseName}`);
    }
  }

  public async down(): Promise<void> {
    // No need to drop the database in the down method
  }
}
