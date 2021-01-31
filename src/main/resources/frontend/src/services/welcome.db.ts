import { IHostEntity, IHostCategory } from '@/pages/Welcome.interface';
import Dexie, { Table } from 'dexie';

class WelcomeDB extends Dexie {
  hosts!: Table<IHostEntity>;
  categorys!: Table<IHostCategory>;

  constructor() {
    super('welcomeDB');
    this.version(2).stores({
      categorys: `++id,name`,
      hosts: `++id,name,protocol,hostname,port,username,possword,thumbnail,ignoreCert,category`,
    });
  }
}
const db = new WelcomeDB();
// console.log('db ...', db);
export default db;
