import pgp, { QueryFile } from 'pg-promise';
import { join } from 'path';

const db = pgp()('postgres://postgres:postgres@localhost:3002');
// Helper for linking to external query files:
function sql(file: string) {
    const fullPath = join(__dirname, file);
    return new QueryFile(fullPath, {minify: true});
}

export async function clearDB() {
  await db.none(`DROP DATABASE IF EXISTS sales_system WITH (FORCE);`);
  const createDbQuery = sql('./create_db.sql');
  await db.none(createDbQuery);
}
