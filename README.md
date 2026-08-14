# NasFinder.com

NasFinder.com은 armsone이 만드는 앱의 기능, 화면, 진행 상황, 사용법과 배포 정보를 소개하는 웹사이트입니다.

## 앱

- 나스파인더 (NasFinder)
- 한클립 (HanClip)
- 에스텐드 (S.tand)
- CCMB

## 로컬 실행

```sh
npm ci
npm run dev
```

## 검증

```sh
npm run build
```

## TestFlight 상태 갱신

TestFlight 빌드가 업로드되면 `app/testflight.ts`에서 해당 앱의 빌드 번호, ISO 8601 업로드 시각과 공개 참여 링크를 갱신합니다. 홈페이지는 업로드 시각부터 90일 만료일까지 남은 기간을 자동으로 계산합니다. 확인되지 않은 날짜는 입력하지 않습니다.

## 공개 전 확인

- App Store·TestFlight·Google Play·GitHub Release 링크와 현재 버전
- 개인정보처리방침 시행일과 법적 운영자 정보
- Cafe24 호스팅 환경과 배포 방식
- 실제 앱 화면의 개인정보 제거
