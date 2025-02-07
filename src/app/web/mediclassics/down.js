import fs from "fs";
import path from "path";

// Mac
// const BASE_DIR = "/Users/youchan/Dev/Jnj-soft/Projects/external/kmc-komed/mediclassics";
// Linux
// const BASE_DIR = "/home/sam/JnJ-soft/Projects/external/kmc-komed/mediclassics"
// Windows
const BASE_DIR = "C:/JnJ-soft/Projects/external/kmc-komed/mediclassics";

// 이미지 URL에서 파일명과 데이터 추출
const getFileInfo = async (FileUrl) => {
  try {
    const response = await fetch(FileUrl);

    // Content-Disposition 헤더에서 파일명 추출
    const contentDisposition = response.headers.get("content-disposition");
    let filename = "";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/fileName=["']?([^"']+)["']?/);
      if (filenameMatch && filenameMatch[1]) {
        // URL 디코딩 수행
        filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ""));
      }
    }

    console.log("디코딩된 파일명:", filename);

    // 파일명이 없으면 URL에서 마지막 부분 사용
    if (!filename) {
      filename = FileUrl.split("/").pop() + ".jpg";
    }

    // 이미지 데이터를 Buffer로 변환
    const FileData = await response.arrayBuffer();
    const buffer = Buffer.from(FileData);

    return {
      filename,
      data: buffer,
      contentType: response.headers.get("content-type"),
      size: buffer.length,
    };
  } catch (error) {
    console.error(`Error fetching File from ${FileUrl}:`, error);
    return null;
  }
};

// 이미지 다운로드 및 저장
const downloadFile = async (FileUrl, outputDir = path.join(BASE_DIR, "data/_files")) => {
  const FileInfo = await getFileInfo(FileUrl);
  const serial = FileUrl.split("/").pop();

  if (!FileInfo) {
    return null;
  }

  // 출력 디렉토리가 없으면 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const filename = `${serial.padStart(4, "0")}_${FileInfo.filename}`;
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, FileInfo.data);

  return {
    ...FileInfo,
    savedPath: outputPath,
  };
};

// const FileUrl = "https://mediclassics.kr/file/image/5";
// await getFileInfo(FileUrl);

// for (let i = 1000; i < 2000; i++) {
//   const FileUrl = `https://mediclassics.kr/file/image/${i}`;
//   await downloadFile(FileUrl);
// }

for (let i = 1; i < 2000; i++) {
  const FileUrl = `https://mediclassics.kr/file/image/${i}`;
  await downloadFile(FileUrl);
}
