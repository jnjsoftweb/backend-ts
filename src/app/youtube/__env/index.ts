import dotenv from 'dotenv';
import { APP_YOUTUBE_DIR_ROOT } from '../../../__env';

// .env 파일 로드, !! 프로젝트 루트 경로 기준 !!
dotenv.config({ path: `${APP_YOUTUBE_DIR_ROOT}/.env` });

const YOUTUBE_API_URL = process.env.YOUTUBE_API_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export {
  YOUTUBE_API_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_API_KEY,
};

console.log(APP_YOUTUBE_DIR_ROOT);
console.log(YOUTUBE_API_URL);
