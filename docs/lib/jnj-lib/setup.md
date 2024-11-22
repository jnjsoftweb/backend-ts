

```bash
# npm run build:watch
npm install -D chokidar

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
