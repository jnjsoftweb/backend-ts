import { GRAPHQL_URL } from '../../__env';
import { YOUTUBE_API_URL } from '../../app/youtube/__env';
import { findFiles } from '../../lib/jnj-lib-base';
import {
  GoogleSheets,
} from '../../lib/jnj-lib-google';
import { Chrome } from '../../lib/jnj-lib-web';

const hello = async () => {
  console.log(GRAPHQL_URL);
  console.log(YOUTUBE_API_URL);
  console.log(
    findFiles(
      'C:/JnJ-soft/Projects/internal/backend-node/node_modules',
      'proto'
    )
  );

  // & jnj-lib-google > Google Sheets
  const spreadsheetId = '13Y3q2mYpGRIIjD2oJZu5YvLIXkQB0jDaHDICNnLqLgE';
  const googleSheets = new GoogleSheets({ spreadsheetId });
  await googleSheets.init();

  const names = await googleSheets.getSheetNames();
  console.log(names);

  // & jnj-lib-web > Chrome
  const chrome = new Chrome({
    headless: false,
    email: 'bigwhitekmc@gmail.com',
    profileName: 'default',
    userDataDir: './chrome-data',
    arguments: [],
  });

  await chrome.goto('https://www.scrapingcourse.com/infinite-scrolling');
};

(async () => {
  await hello();
})();
