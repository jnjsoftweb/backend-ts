[npm install시 node-gyp 에러](https://velog.io/@wjs4199/React-npm-install시-node-gyp-에러)


어휴^^...
결국 npm-gyp 공식문서 보면서 해결!

https://www.npmjs.com/package/node-gyp

🐱‍👤npm-gyp란?
cross-platform command-line tool 로, native addon modules를 컴파일 해주는 도구.
(native addon modules란 C나 C++로 작성된 동적 링크 공유 객체로 노드의 require() 함수에 의해 로드 되어 일반적인 노드 모듈처럼 사용됨)

덧붙이자면...

Node-gyp는 Node.js 자체를 빌드하는 데 사용되진 않음.
node-gyp가 nodejs 버전에 필요한 개발 파일 또는 헤더를 알아서 다운하기 때문에 버전에 관계없이 여러버전에서 사용 가능!
설치 명령 : npm install -g node-gyp

😂 node-gyp 오류 해결과정!
오류 해결의 키 포인트는 node-gyp는 python과 visual studio build tools에 의존하기 때문에 이에 대한 셋팅을 해주는 것!

먼저 cmd를 열고...(window 유저임^_^)

npm install --global windows-build-tools
(현재 node.js에는 window를 위한 build tools이 포함되어 있기 때문에 이 부분은 건너뛰어도 된다고 함. nodejs 깔 때 자동으로 필요한 도구 설치 와 관련된 체크박스가 있는데 여기에 체크 하면 자동설치가 되는 듯! + 그리고 실제로 cmd에서 위 명령실행하니까 자꾸 stuck 됨,,,)

npm config set msvs_version 2017
(npm config npm 의 설정 조작 명령어, set [이름][값] 을 추가하여 속성을 설정함)

npm config set python /path/to/executable/python
파이썬의 버전이 node-gyp와 호환가능한 버전인지 확인 후, 만약 설치된 python버전이 여러개라면 그 중 뭘 사용할 것인지 지정해야함!
(뒤에 주소는 파이썬 툴이 존재하는 경로)
나의 경우 설치한 파이썬의 버전이 여러개는 아니었지만,,,, 일단 해줌..!ㅎ

npm install --global node-gyp
(node-gyp 설치)

vs code를 껐다 켜서 다시 npm install 해보니 잘 작동됨!🤣