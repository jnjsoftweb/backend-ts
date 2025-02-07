
```prompt
typescript 코딩시에 상대 경로 대신, next.js 처럼 'src' 폴더를 '@'로 인식할 수 있게 하려면 어떻게 설정해야 돼?
esbuild를 사용하고, es6 문법으로 코딩하려고 하는데, 프로젝트 개발 환경을 구축하는 방법을 자세히 말해줘.
```


```bash
# 1. 프로젝트 초기화
mkdir ts-project
cd ts-project
npm init -y

# 2. 필요한 패키지 설치
npm install --save-dev typescript @types/node esbuild
npm install --save-dev nodemon

# 3. TypeScript 초기화
npx tsc --init
```


> `tsconfig.json` 파일을 수정해야 합니다. 이 파일은 프로젝트의 타입스크립트 설정을 정의하는 파일입니다. 이 파일을 수정하여 상대 경로를 사용하도록 설정해야 합니다.

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

> `build.js`

```js
const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  platform: 'node',
  format: 'esm',
  target: 'es6',
  alias: {
    '@': path.resolve(__dirname, './src')
  },
  watch: process.argv.includes('--watch'),
}).catch(() => process.exit(1));
```

> `package.json`

```json
{
  "scripts": {
    "build": "node build.js",
    "dev": "node build.js --watch",
    "start": "node dist/bundle.js"
  }
}
```


프로젝트 구조는 다음과 같습니다:

```
ts-project/
├── src/
│   └── index.ts
├── build.js
├── package.json
└── tsconfig.json
```

사용 예시:

```typescript
// src/utils/helper.ts
export const add = (a: number, b: number) => a + b;
```

```typescript
// src/index.ts
import { add } from '@/utils/helper';

console.log(add(1, 2));
```

이제 다음 명령어로 프로젝트를 실행할 수 있습니다:

```bash
npm run dev - 개발 모드 (파일 변경 감지)
npm run build - 프로덕션 빌드
npm start - 빌드된 파일 실행
```

주요 특징:

@ 별칭을 통해 src 폴더의 파일들을 절대 경로로 import 할 수 있습니다
ES6 문법 지원
TypeScript 타입 체킹
esbuild를 통한 빠른 빌드
개발 시 파일 변경 감지 (watch 모드)

필요한 추가 설정이나 다른 기능이 있다면 말씀해 주세요!
