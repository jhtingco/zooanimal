# 🦁 전국 동물원 지도 (ZooSafari Korea)

Next.js 16 (App Router, TypeScript)와 **카카오맵(Kakao Maps) JavaScript API**를 활용한 전국 동물원·아쿠아리움·생태체험장 통합 탐색 웹 서비스입니다. Vercel 원클릭 배포에 최적화되어 있습니다.

---

## ✨ 주요 기능

1. **카카오맵 인터랙티브 지도 연동**
   - 전국 주요 동물원의 실제 GPS 좌표 기반 커스텀 핀 및 오버레이 제공
   - 지도 핀 클릭 시 상세 오버레이 및 부드러운 위치 이동(PanTo)
   - 카카오맵 API 키가 아직 없더라도 안전한 인터랙티브 프리뷰 및 친절한 설정 가이드 모달 제공
   - 카카오맵 길찾기 웹/앱 바로가기 지원 (`kakaomap://` 및 `map.kakao.com/link/to/...`)

2. **전국 주요 동물원 데이터베이스 (18개소+)**
   - 수도권, 강원, 충청, 전라, 경상, 제주 등 6대 권역별 분류
   - 대형 종합 동물원, 사파리 테마파크, 아쿠아리움, 자연방목 목장, 동물복지 생태공원
   - 입장료(성인/청소년/어린이/무료 조건), 관람시간, 휴원일, 대표 동물, 편의시설 정보 완비

3. **스마트 필터 & 실시간 검색**
   - 권역별 탭(수도권, 강원, 충청, 전라, 경상, 제주)
   - 카테고리 필터(대형 동물원, 아쿠아리움, 생태체험, 목장형 등)
   - 실시간 키워드 검색 (동물 이름 예: `판다`, `호랑이`, `알파카` 또는 지역/시설명 검색)
   - 평점순, 리뷰순, 이름순 정렬

4. **상세정보 모달 & 로컬 즐겨찾기(Favorites)**
   - 동물원별 상세 모달 (주소 복사, 전화 연결, 공식 웹사이트 링크)
   - 로컬스토리지(`localStorage`) 기반 즐겨찾기 저장 및 모아보기

5. **REST API 엔드포인트 제공**
   - `/api/zoos?region=수도권&category=major&q=판다` 형태로 필터 및 검색 결과 제공

---

## 🛠️ 시작하기 (Local Setup)

### 1. 패키지 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```
브라우저에서 `http://localhost:3000` 접속

---

## 🗺️ 카카오맵 API 키 설정 방법 (필수)

지도가 정상적으로 표시되려면 **카카오 개발자 센터**에서 발급받은 **JavaScript 키**가 필요합니다.

### 1단계: 카카오 개발자 센터에서 키 발급
1. [카카오 개발자 콘솔(Kakao Developers)](https://developers.kakao.com) 로그인
2. **[내 애플리케이션]** > **[애플리케이션 추가하기]** (앱 이름, 사업자명 자유 입력)
3. 생성된 앱의 **[앱 키]** 목록에서 **`JavaScript 키`**를 복사합니다.  
   *(※ 주의: REST API 키나 Admin 키가 아닌 반드시 **JavaScript 키**를 사용해야 합니다.)*

### 2단계: Web 플랫폼 도메인 등록 (필수!)
카카오맵은 보안을 위해 등록된 도메인에서만 지도를 호출할 수 있도록 제한합니다.
1. 앱 설정 메뉴의 **[플랫폼]** > **[Web 플랫폼 등록]** 클릭
2. **사이트 도메인**에 아래 주소를 등록합니다:
   ```
   http://localhost:3000
   https://<내-프로젝트-이름>.vercel.app
   ```
   *(도메인은 줄바꿈으로 여러 개 등록 가능합니다)*

### 3단계: 로컬 환경 변수 파일 생성
프로젝트 루트의 `.env.local` 파일에 복사한 키를 붙여넣습니다:
```env
NEXT_PUBLIC_KAKAO_MAP_KEY=발급받은_JavaScript_키_입력
```

---

## 🚀 Vercel 배포 가이드

이 프로젝트는 Vercel 배포에 최적화되어 있습니다.

### 방법 1: GitHub 리포지토리 연동 (가장 추천)
1. 프로젝트를 GitHub에 Push합니다.
2. [Vercel 대시보드](https://vercel.com)에서 **Add New...** > **Project**를 선택하고 GitHub 리포지토리를 Import합니다.
3. **Environment Variables** 설정 섹션에서 환경 변수를 추가합니다:
   - **Key**: `NEXT_PUBLIC_KAKAO_MAP_KEY`
   - **Value**: `발급받은_JavaScript_키`
4. **Deploy** 버튼을 누릅니다.
5. 배포 완료 후 발급된 Vercel URL(`https://<project-name>.vercel.app`)을 **카카오 개발자 콘솔의 Web 플랫폼 사이트 도메인**에 추가 등록합니다.

### 방법 2: Vercel CLI 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포 실행
vercel

# 환경 변수 등록
vercel env add NEXT_PUBLIC_KAKAO_MAP_KEY

# 프로덕션 배포
vercel --prod
```

---

## 📂 프로젝트 구조

```
zooanimal/
├── public/                 # 정적 리소스 및 파비콘
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── zoos/       # 동물원 데이터 검색 및 필터 API (/api/zoos)
│   │   ├── globals.css     # Pretendard 폰트 및 Safari Emerald 테마 토큰
│   │   ├── layout.tsx      # SEO 메타태그 및 레이아웃
│   │   ├── page.module.css # 메인 페이지 레이아웃 스타일
│   │   └── page.tsx        # 메인 인터랙티브 지도 & 카드 탐색 페이지
│   ├── components/
│   │   ├── Header.tsx      # 헤더 (검색, 즐겨찾기, 통계 배지, 설정 안내)
│   │   ├── FilterBar.tsx   # 권역별 탭, 카테고리 칩, 정렬 셀렉터
│   │   ├── KakaoMap.tsx    # 카카오맵 SDK 로더, 커스텀 오버레이, 폴백 뷰
│   │   ├── ZooCard.tsx     # 동물원 카드 (대표 동물, 관람시간, 길찾기 링크)
│   │   ├── ZooDetailModal.tsx # 동물원 상세 팝업 (요금표, 주소복사, 편의시설)
│   │   └── ApiKeyGuideModal.tsx # 카카오맵 API 키 발급 및 Vercel 배포 안내 모달
│   ├── data/
│   │   └── zoos.ts         # 전국 18개소 상세 동물원 데이터베이스
│   └── types/
│       ├── kakao.d.ts      # 카카오맵 JS SDK TypeScript 타입 정의
│       └── zoo.ts          # 동물원 데이터 및 필터 타입 인터페이스
├── .env.example            # 환경 변수 템플릿
├── next.config.ts          # Next.js 설정 (외부 이미지 허용 호스트 등)
├── tsconfig.json           # TypeScript 설정
└── package.json
```
