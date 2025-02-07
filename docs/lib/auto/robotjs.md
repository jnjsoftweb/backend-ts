windows-build-tools 설치 오류가 발생했네요. Node.js 20 버전에서는 호환성 문제가 있는 것 같습니다. 대신 다음과 같은 방법을 시도해보시기 바랍니다:
Visual Studio Build Tools를 직접 설치하세요:
Visual Studio Build Tools 다운로드
설치 시 "C++ 빌드 도구" 워크로드를 선택하세요
Python을 설치하세요 (이미 설치되어 있다면 건너뛰어도 됩니다):
Python 다운로드
설치 시 "Add Python to PATH" 옵션을 체크하세요
설치 후 프로젝트 폴더에서 다음 명령어를 실행하세요:


```sh
npm config set python python3.12
npm config set msvs_version 2022

npm cache clean --force
npm install robotjs --save
```


## node.js 버전 변경

```sh
nvm install 18.19.0
nvm use 18.19.0
```

