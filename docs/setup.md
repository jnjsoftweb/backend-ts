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

# jnj-lib-dev  depends on `jnj-lib-base`
npm install @octokit/rest@16

# jnj-lib-db  depends on `jnj-lib-base`
npm install sqlite3 pocketbase mysql2 postgres

# npm install @supabase/supabase-js
# npm i firebase

# jnj-lib-auto  depends on `jnj-lib-base`
npm install -g node-gyp windows-build-tools
npm cache clean --force
npm install robotjs --save
npm i @nut-tree-fork/nut-js
# npm install ahknodejs
```


Visual Studio Build Tools를 직접 설치하세요:
[Visual Studio Build Tools 다운로드](https://visualstudio.microsoft.com/ko/visual-cpp-build-tools/)
설치 시 "C++ 빌드 도구" 워크로드를 선택하세요
Python을 설치하세요 (이미 설치되어 있다면 건너뛰어도 됩니다):
Python 다운로드
설치 시 "Add Python to PATH" 옵션을 체크하세요


npm config set python python3.12
npm config set msvs_version 2022

npm cache clean --force
npm install robotjs --save


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

