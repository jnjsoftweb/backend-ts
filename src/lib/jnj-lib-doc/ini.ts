import ini from 'ini';
import { loadFile, saveFile } from '../jnj-lib-base';

const loadIni = (path: string) => {
  return ini.parse(loadFile(path));
};

const saveIni = (path: string, data: any) => {
  return saveFile(path, ini.stringify(data));
};

export { loadIni, saveIni };
