import dotenv from 'dotenv';

// * 환경 설정 루트 경로
const ENV_ROOT = `C:/JnJ-soft/Projects/internal/backend-ts`;

// .env 파일 로드, !! 프로젝트 루트 경로 기준 !!
dotenv.config({ path: `${ENV_ROOT}/.env` });

// `/.env` 파일 환경 변수
const DEV_SETTINGS = process.env.DEV_SETTINGS;
const PROJECT_ROOT = process.env.PROJECT_ROOT;
const APP_DIR_ROOT = process.env.APP_DIR_ROOT;
const APP_URL_ROOT = process.env.APP_URL_ROOT;

// const EXPRESS_PORT = process.env.EXPRESS_PORT;
const GRAPHQL_PORT = process.env.GRAPHQL_PORT;

// const DB_ROOT_FOLDER = process.env.DB_ROOT_FOLDER;
// const DB_JSON_FOLDER = process.env.DB_JSON_FOLDER;
// const DB_SQLITE_FOLDER = process.env.DB_SQLITE_FOLDER;

const GRAPHQL_URL = `${APP_URL_ROOT}:${GRAPHQL_PORT}`;

// app roots
const APP_YOUTUBE_DIR_ROOT = `${APP_DIR_ROOT}/src/app/youtube`;

export {
  DEV_SETTINGS,
  PROJECT_ROOT,
  GRAPHQL_PORT,
  GRAPHQL_URL,
  APP_YOUTUBE_DIR_ROOT,
};
