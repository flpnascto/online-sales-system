import pgp, { QueryFile } from 'pg-promise';
import { join } from 'path';
import { IClient } from 'pg-promise/typescript/pg-subset';

// Helper for linking to external query files:
function sql(file: string) {
    const fullPath = join(__dirname, file);
    return new QueryFile(fullPath, {minify: true});
  }
  
export async function clearDB() {
    //   await db.none(`DROP DATABASE IF EXISTS sales_system WITH (FORCE);`);
const conn = pgp()('postgres://postgres:postgres@localhost:3002');
const createDbQuery = sql('./create_db.sql');
await conn.none(createDbQuery);
await conn.$pool.end();
}
