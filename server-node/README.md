#Server-Node
NodeJs + Express + MongoDB With Typescript = Blog RestApi Server

##1. Start
```javascript
1. npm install
2. typings install
2. .env 수정 // 설정 수정
3. npm run start // typescipt 컴파일 및 구동
```

##2. Test
테스트는 BDD 방식이고 restApi 테스트만 한다.
```javascript
1. npm run start
	- rest api 테스트이기 때문에 서버를 구동후 진행해야된다.
	- 서버를 구동까지 자동으로 하고 싶으면 해당 test코드쪽에서 주석 처리 되어 있는 const server: any = request.agent(app);으로 변경 처리 해야된다.
2. npm test
```

##3. Directory Structure
```javascript
├── config     <- 설정 관련 파일(server 설정 및 router 설정)
├── models     <- mongoDB model과 schema 정의
├── module     <- 모듈(로그, 에러 등등)
├── router     <- router (컨트롤러와 같은 역활 // 기능별로 분류)
├── service    <- 비지니스 로직 영역 (복잡해지면 하위 폴더 생성)
└── test       <- 테스트 코드
     └── file  <- 파일 업로드 테스트를 위한 파일 위치
```
##4. Contact
mayajuni10@gmail.com 으로 이메일 주세요.
