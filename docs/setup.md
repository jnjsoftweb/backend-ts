## install

### swc

```bash
mkdir backend-ts
cd backend-ts
npm init -y

# swc
npm install --save-dev @swc/cli @swc/core typescript

# npm run build:watch
npm install -D chokidar
```

### jnj-lib

```bash
# jnj-lib-base
npm install -D dotenv

# jnj-lib-doc  depends on `jnj-lib-base`
npm install js-yaml ini csv-parse csv-stringify node-xlsx --save
npm i --save-dev @types/ini @types/js-yaml

# jnj-lib-google  depends on `jnj-lib-base` `jnj-lib-doc`
# npm install googleapis@105 @google-cloud/local-auth@2.1.0 @google/generative-ai --save

npm install googleapis @google-cloud/local-auth @google/generative-ai --save

# jnj-lib-web  depends on `jnj-lib-base`
npm install cheerio selenium-webdriver axios install @types/selenium-webdriver @types/selenium-webdriver
```

### graphql

```bash
npm install @apollo/server @apollo/server/standalone @apollo/server-plugin-landing-page-graphql-playground
```

```bash
cd backend-ts
npm install
```


## sample code

> `src/service/test/index.ts`


## run test

```bash
npm run build:watch

cd src/service/test
node index.js
```


## github

```bash
# push(create) repo
github -e pushRepo -n backend-ts -u jnjsoftweb -d "Backend Service in Typescript(SWC)"

# copy repo
github -e copyRepo -n backend-ts -u jnjsoftweb
```

