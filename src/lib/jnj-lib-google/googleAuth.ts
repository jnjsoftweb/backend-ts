/** googleAuth
 *
 * Description
 *   - A Class For Google Authentication
 *
 * Functions
 *   [X] Authentication for GoogleAPI
 *
 * Usages
 *   -
 *
 * Requirements
 *   - npm install googleapis@105 @google-cloud/local-auth@2.1.0 --save
 *   - npm install -D @octokit/rest dotenv jnj-lib-base
 *
 * References
 *
 * Authors
 *   - Moon In Learn <mooninlearn@gmail.com>
 *   - JnJsoft Ko <jnjsoft.ko@gmail.com>
 */

// & Import AREA
// &---------------------------------------------------------------------------
// ? Builtin Modules

import Path from 'path';

// ? External Modules
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
// import dotenv from "dotenv";

// ? UserMade Modules
import { loadJson, saveJson } from '../jnj-lib-base';
import { DEV_SETTINGS } from '../../__env';

// & Variable AREA
// &---------------------------------------------------------------------------
// dotenv.config(); // 실행 경로에 있는 `.env`

const settingsPath = DEV_SETTINGS;

const getScopes = (user = 'bigwhitekmc', sn = 0) => {
  const path = Path.join(
    settingsPath!,
    `Apis/google/spec/scopes_${user}_${sn}.json`
  );
  let scopes = loadJson(path);
  return (
    scopes ??
    loadJson(Path.join(settingsPath!, `Apis/google/spec/scopes_default.json`))
  );
};

// & Class AREA
// &---------------------------------------------------------------------------
export class GoogleAuth {
  tokenPath: string = '';
  crendentialsPath: string = '';
  scopes: string[];
  // client; // OAuth2Client

  // & CONSTRUCTOR
  // apiKey(Google API Key) | oauth2(Google OAuth 2.0 Client ID) | serviceAccount(Google Service Account)
  // <type>_<user>_<sn>.json   oauth2: gsa_mooninlearn_0
  constructor(user: string, type: string = 'oauth2', sn: number = 0) {
    this.scopes = getScopes(user, sn);
    switch (type) {
      case 'oauth2':
        this.tokenPath = Path.join(
          settingsPath!,
          `Apis/google/token_${user}_${sn}.json`
        );
        this.crendentialsPath = Path.join(
          settingsPath!,
          `Apis/google/${type}_${user}_${sn}.json`
        );
    }
  }

  // & AUTHORIZATION
  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async loadSavedCredentialsIfExist() {
    try {
      return await google.auth.fromJSON(JSON.parse(loadJson(this.tokenPath)));
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async saveCredentials(client: any) {
    const keys = loadJson(this.crendentialsPath);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      expiry_date: client.credentials.expiry_date,
      refresh_token: client.credentials.refresh_token,
    });
    saveJson(this.tokenPath, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   */
  async authorize() {
    let client: any = await this.loadSavedCredentialsIfExist();
    if (client) {
      // Check if the token is expired
      const isExpired =
        client.credentials.expiry_date &&
        Date.now() >= client.credentials.expiry_date;
      if (isExpired) {
        console.log('Token has expired, refreshing...');
        client = await this.refreshAccessToken(client);
      }
      return client;
    }
    client = await authenticate({
      scopes: this.scopes,
      keyfilePath: this.crendentialsPath,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  async refreshAccessToken(client: any) {
    const { token } = await client.getAccessToken();
    client.credentials.access_token = token;
    client.credentials.expiry_date = Date.now() + 3600 * 1000; // 1 hour from now
    await this.saveCredentials(client);
    return client;
  }
}

// // & Test AREA
// // &---------------------------------------------------------------------------
// const googleAPI = new GoogleAuth("bigwhitekmc", "oauth2");

// // * 인증 TEST
// const authed = await googleAPI.authorize();
// console.log(authed);
