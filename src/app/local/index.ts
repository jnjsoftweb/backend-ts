import { loadJson, loadFile } from '@/lib/jnj-lib-base';

// create project
// const createNodeProject = (projectName: string) => {
//   const packageJson = loadJson(PACKAGE_JSON);
// };

const helloLocal = () => {
  return { message: 'hello local' };
};

export { helloLocal };
