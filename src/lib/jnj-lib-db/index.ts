import { Sqlite } from './sqlite';

export { Sqlite };

const dbName = 'youtube';
const sqlite = new Sqlite(dbName);