import { Chrome } from "jnj-lib-web";
import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";
import { loadJson, saveJson, saveFile, loadFile } from "jnj-lib-base";
import { By, until } from "selenium-webdriver"; // 추가된 부분

const BASE_URL = "https://mediclassics.kr";

// Mac
// const BASE_DIR = "/Users/youchan/Dev/Jnj-soft/Projects/external/kmc-komed/mediclassics";
// Linux
// const BASE_DIR = "/home/sam/JnJ-soft/Projects/external/kmc-komed/mediclassics"
// Windows
const BASE_DIR = "C:/JnJ-soft/Projects/external/kmc-komed/mediclassics";

const HTML_STATIC_ROOT = `${BASE_DIR}/data/html`;
const HTML_DYNAMIC_ROOT = `${BASE_DIR}/data/_html7`;
const JSON_BOOK_LIST = `${BASE_DIR}/bookList.json`;
// const JSON_FOLDER = 'C:/JnJ-soft/Projects/external/kmc-komed/mediclassics/data/json'

// const MAX_ATTEMPTS = 2;
// const ATTEMPTS_WAIT_TIME = 500;
const MAX_RETRIES = 10;
const RETRIES_WAIT_TIME = 5000;
const LOADED_WAIT_TIME = 60000;

const DESC_SECTION = "div[class*=section_desc]";
// const DESC_SECTION = "div[class*=section_desc]:not([bottom_count='0'])";

// ** 스크래핑 후 처리
const findFiles = (folder = HTML_DYNAMIC_ROOT) => {
  const files = [];

  const traverseDirectory = (currentPath) => {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else {
        files.push(fullPath);
      }
    });
  };

  traverseDirectory(folder);
  return files;
};

const urlFromPath = (path) => {
  const [bookNum, volumeNum] = path.split("/").slice(-1)[0].split(".")[0].split("_");
  return `${BASE_URL}/books/${bookNum}/volume/${volumeNum}`;
};

// 파일에 bottomCollapseDirectionClose 클래스가 있는지 확인
const hasClosedFold = (filePath) => {
  return loadFile(filePath).includes("bottomCollapseDirectionClose");
};

// 재스크래핑이 필요한 URL 목록 반환
const urlsReScrape = (folder = HTML_DYNAMIC_ROOT) => {
  return findFiles(folder)
    .filter((file) => hasClosedFold(file))
    .map((file) => urlFromPath(file));
};

// 파일에 있는 img 태그의 src 속성 추출
const extractImgSrc = (filePath) => {
  const $ = cheerio.load(loadFile(filePath));
  return $("img")
    .map((i, el) => $(el).attr("src"))
    .get();
};

const extractImgSrcsInFolder = (folder = HTML_DYNAMIC_ROOT) => {
  return [
    ...new Set(
      findFilesInFolderRecursively(folder)
        .map((file) => extractImgSrc(file))
        .flat()
    ),
  ].map((src) => `${BASE_URL}${src}`);
};

// 이미지 URL에서 파일명과 데이터 추출
const getImageInfo = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);

    // Content-Disposition 헤더에서 파일명 추출
    const contentDisposition = response.headers.get("content-disposition");
    let filename = "";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // 파일명이 없으면 URL에서 마지막 부분 사용
    if (!filename) {
      filename = imageUrl.split("/").pop() + ".jpg";
    }

    // 이미지 데이터를 Buffer로 변환
    const imageData = await response.buffer();

    return {
      filename,
      data: imageData,
      contentType: response.headers.get("content-type"),
      size: imageData.length,
    };
  } catch (error) {
    console.error(`Error fetching image from ${imageUrl}:`, error);
    return null;
  }
};

// 이미지 다운로드 및 저장
const downloadImage = async (imageUrl, outputDir = path.join(BASE_DIR, "data/images")) => {
  const imageInfo = await getImageInfo(imageUrl);

  if (!imageInfo) {
    return null;
  }

  // 출력 디렉토리가 없으면 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, imageInfo.filename);
  fs.writeFileSync(outputPath, imageInfo.data);

  return {
    ...imageInfo,
    savedPath: outputPath,
  };
};

// ** 스크래핑

function envelopeHtml(html) {
  return html;
  // return `<html><body>${html}</body></html>`;
}

function getVolumeInfo(url) {
  const parts = url.split("/");
  let bookNum = "";
  let volumeNum = "";

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "books") {
      bookNum = parts[i + 1];
    }
    if (parts[i] === "volume") {
      volumeNum = parts[i + 1];
    }
  }

  return { bookNum, volumeNum };
}

function pathFromUrl(url) {
  const base = BASE_URL.split("/").slice(-1)[0];
  return url
    .split(base)
    .slice(-1)[0]
    .split("/")
    .filter((s) => s !== "")
    .join("/");
}

function staticHtmlPathFromUrl(url) {
  return `${HTML_STATIC_ROOT}/${pathFromUrl(url)}/index.html`;
}

function dynamicHtmlPathFromUrl(url) {
  return `${HTML_DYNAMIC_ROOT}/${pathFromUrl(url)}.html`;
}

function htmlPathFromUrl(url, type = "static") {
  return type === "static" ? staticHtmlPathFromUrl(url) : dynamicHtmlPathFromUrl(url);
}

// 한의학고전DB 서적 리스트(권url 포함) -> json File(bookList.json)
async function fetchBookList(soup) {
  const lists = soup("tr.ng-scope");
  const bookList = [];

  for (const ls of lists) {
    const dic = {
      index: "",
      title: "",
      volumes: "",
      size: "",
      url: "",
      url_v: [],
    };

    dic.index = soup(ls).find("th").text().trim();
    const tds = soup(ls).find("td");
    dic.title = soup(tds[0]).text().trim();
    dic.volumes = soup(tds[1]).text().trim();
    dic.size = soup(tds[2]).text().trim();
    dic.url = soup(ls).find("a").attr("href");
    dic.url_v = await fetchVolumeList(dic.url);

    bookList.push(dic);
  }

  // console.log(bookList);

  // await fs.writeFile("bookList.json", JSON.stringify(bookList, null, 2), "utf-8");
  saveJson("../../bookList.json", bookList);
  await chrome.close();
}

// ** 클래스
class Mediclassics {
  constructor() {
    this.chrome = new Chrome({
      headless: false,
      email: "bigwhitekmc@gmail.com",
    });
  }

  async fetchStaticHtml(url = "https://mediclassics.kr/books/162/", waitEl = "", waitTime = 3000) {
    try {
      await this.chrome.goto(url);
      if (waitEl != "") {
        const elements = await this.chrome.findElements(waitEl);
      } else {
        await this.chrome.driver.sleep(waitTime);
      }

      const html = await this.chrome.getPageSource();
      // console.log(html);
      return html;
    } catch (error) {
      console.error("Error in fetchVolumeList:", error);
      return [];
    }
  }

  async saveStaticHtml(url, waitEl = "", waitTime = 3000) {
    saveFile(staticHtmlPathFromUrl(url), await this.fetchStaticHtml(url, waitEl, waitTime));
    await this.chrome.driver.sleep(1000);
  }

  async foldedDivs(section, depth) {
    const sel = `div.sec_h${depth}:not(.no-child):not(.loaded)`;
    return await section.findElements(By.css(sel));
  }

  async allFoldDivs(section, depth) {
    const sel = `div.sec_h${depth}:not(.no-child):not([bottom_count="0"])`;
    return await section.findElements(By.css(sel));
  }

  // bottom_count="0"

  async isLoaded(div) {
    const className = await div.getAttribute("class");
    return className.includes("loaded");
  }

  // * loaded 상태에서 표제어 접힌 상태인지 확인
  async isClosed(div) {
    const className = await div.getAttribute("class");
    return className.includes("bottomCollapseDirectionClose");
    // return !className.includes("sec_h3") || className.includes("bottomCollapseDirectionClose");
  }

  async clickFold(div, waitTime = 500) {
    try {
      // 요소가 화면에 보이도록 스크롤
      await this.chrome.driver.executeScript("arguments[0].scrollIntoView(true);", div);
      await this.chrome.driver.sleep(100); // 스크롤 완료 대기

      // 클릭 시도
      await this.chrome.driver.executeScript("arguments[0].click();", div);
      // console.log(`+++++click div`);

      // loaded 클래스가 추가될 때까지 명시적으로 대기
      try {
        await this.chrome.driver.wait(async () => {
          const className = await div.getAttribute("class");
          return className.includes("loaded");
        }, LOADED_WAIT_TIME);

        console.log(`+++++loaded 상태 확인됨`);

        const _isClosed = await this.isClosed(div);
        // console.log(`******_isClosed: ${_isClosed}`);

        if (_isClosed) {
          await this.chrome.driver.executeScript("arguments[0].click();", div);
          await this.chrome.driver.sleep(100);
        }
        return true;
      } catch (timeoutError) {
        console.log(`!!!!!loaded 상태 대기 시간 초과`);
        return false;
      }
    } catch (error) {
      console.error("Error in clickFold:", error);
      return false;
    }
  }

  // * 표제어 펼치기/접기
  async openFold(section, depth) {
    const divs = await this.allFoldDivs(section, depth);
    let _isLoaded = false;
    let titleText = "--";

    for (const div of divs) {
      try {
        const title = await div.findElement(By.css("a[title='표제어 펼치기/접기']"));
        titleText = await title.getText();

        console.log(`##### div: ${titleText}`);

        let attempts = 0;
        let retries = 0;
        _isLoaded = await this.clickFold(div);
        while (_isLoaded == false) {
          if (retries < MAX_RETRIES) {
            _isLoaded = await this.clickFold(div, RETRIES_WAIT_TIME);
            retries++;
            console.log(`${retries}번째 retry 시도`);
          } else {
            console.log(`!!!! ${depth} ${titleText}번째 표제어 펼치기/접기 실패`);
            return 0;
          }
        }
      } catch (error) {
        console.error("Error in openFold:", error);
      } finally {
        console.log(`=======${depth} ${titleText}`);
      }
    }
    return 1;
  }

  // * 서적 섹션 페이지 크롤링
  async fetchVolume(url, foldCss = DESC_SECTION) {
    await this.chrome.goto(url);
    await this.chrome.driver.executeScript("localStorage.clear();");
    console.log(`cache is cleared url: ${url}`);

    // * 서적 섹션 페이지 로딩 대기
    await this.chrome.driver.wait(until.elementLocated(By.css(foldCss)), 120000);

    // open fold
    const sections = await this.chrome.driver.findElements(By.css(foldCss));

    for (const depth of ["3", "4", "5", "6", "7", "8", "9"]) {
      for (const section of sections) {
        const success = await this.openFold(section, depth);
        if (!success) {
          // 수동으로 펼치기
          console.log(`!!!!!! 수동으로 펼치기 해야 합니다. url: ${url}`);
          return "";
        }
      }
    }

    // return await this.chrome.driver.getPageSource();
    const html = await this.chrome.getPageSource();
    const $ = cheerio.load(html);

    return $.html($("#container"));
  }

  async saveVolume(url, foldCss = DESC_SECTION) {
    const html = await this.fetchVolume(url, foldCss);
    const { bookNum, volumeNum } = getVolumeInfo(url);
    saveFile(`${HTML_DYNAMIC_ROOT}/${bookNum}_${volumeNum}.html`, envelopeHtml(html));
    return html;
  }

  async saveBook(bookObj, foldCss = DESC_SECTION) {
    const url_v = bookObj.url_v;
    for (const url of url_v) {
      const html = await this.saveVolume(url, foldCss);
      if (html == "") {
        return "";
      }
    }
    return "success";
  }

  async saveBooks(books) {
    for (const book of books) {
      const html = await this.saveBook(book);
      if (html == "") {
        return "";
      }
    }
    return "success";
  }
}

export default Mediclassics;

// * static html
const m = new Mediclassics();
const books = loadJson(JSON_BOOK_LIST);

// const url = "https://info.mediclassics.kr/contents/database/list";
// console.log(staticHtmlPathFromUrl(url));
// await m.saveStaticHtml(url);

// await m.saveStaticHtml(url);

// for (const book of books) {
//   await m.saveStaticHtml(book.url);
// }

// await m.chrome.close();

// // * dynamic html
const urls = [
  "https://mediclassics.kr/books/135/volume/94",
  "https://mediclassics.kr/books/135/volume/95",
  "https://mediclassics.kr/books/135/volume/96",
  "https://mediclassics.kr/books/135/volume/97",
  "https://mediclassics.kr/books/135/volume/98",
  "https://mediclassics.kr/books/135/volume/99",
  "https://mediclassics.kr/books/135/volume/100",
];
for (const url of urls) {
  const html = await m.saveVolume(url);
}
// if (html == "") {
//   console.log(`!!!!!! 수동으로 펼치기 해야 합니다. url: ${url}`);
// } else {
//   await m.chrome.close();
// }

// // // // "title": "비위론"
// // // // const book = books.find(b => b.title === "비위론");

// // 101, 102 105,107 다시
// 115: 식료본초, 149: 천금익방
// const html = await m.saveBooks(books.slice(154,158));
// if (html !== "") {
//   await m.chrome.close();
// }

// content_level: 'A', 'B', 'E', 'S', 'Z'
// bottomCollapseDirectionOpen bottomCollapseDirectionClose
// loaded

// Error in openFold: ElementClickInterceptedError: element click intercepted: Element <div id="content_91" upath="1,75" up_content_seq="75" bottom_count="5" class="sec_div bottomCollapseDirectionClose title_section sec_h6" seq="91" up_path_nm="康平傷寒論 > 辨大陽病" content_level="E" content_level_depth="P">...</div> is not clickable at point (331, 26). Other element would receive the click: <div id="global">...</div>

// 145 확인

// @@@@ 교정(추가) 필요
// https://mediclassics.kr/books/146/volume/2 :  '傷汗遺事' 추가(없음)

{
  /* <div id="content_455" upath="1,2,425" up_content_seq="425" bottom_count="0" class="sec_div title_section sec_h7" seq="455" up_path_nm="世醫得效方卷第二 > ○大方脉雜醫科 > ○時疫" content_level="F" content_level_depth="P"><div class="h-div"><h6 class="chinese or sec_node"><a href="javascript:;" role="button" title="표제어 펼치기/접기">&nbsp;<span class="print-ng">傷汗遺事</span></a></h6></div><div class="num-div"><span class="sec_num">1.14.11</span><span class="prescription color-f">방제</span></div><div class="clearfix"></div></div> */
}

// https://mediclassics.kr/books/146/volume/3 :  '除濕湯ㆍ五苓散. 方見傷濕ㆍ傷暑類.' 추가(없음)

//* bottomCollapseDirectionClose
// const urls = [
//   "https://mediclassics.kr/books/144/volume/3",
//   "https://mediclassics.kr/books/146/volume/13",
//   "https://mediclassics.kr/books/146/volume/14",
//   "https://mediclassics.kr/books/146/volume/15",
//   "https://mediclassics.kr/books/146/volume/16",
//   "https://mediclassics.kr/books/146/volume/17",
//   "https://mediclassics.kr/books/146/volume/18",
//   "https://mediclassics.kr/books/146/volume/19",
//   "https://mediclassics.kr/books/146/volume/20"
// ]

// * 이미지 다운로드
// imageUrl='https://mediclassics.kr/file/image/2389'

// const imageInfo = await downloadImage(imageUrl);
// console.log('Downloaded image information:', {
//   filename: imageInfo.filename,
//   contentType: imageInfo.contentType,
//   size: `${(imageInfo.size / 1024).toFixed(2)} KB`,
//   savedPath: imageInfo.savedPath
// });
