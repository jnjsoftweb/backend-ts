// # project install
// node
import { exe } from "../jnj-lib-base";

const createProject = (name: string, { platform, template, description, github, root }: { platform: 'node' | 'react', template: 'template-vite-react-ts-tailwind', description: string, github: string, root: string }) => {
    const cmds = [
        `npm create vite ${name} -- --template template-vite-react-ts-tailwind`,
    ];
    exe(cmds);
};
