import { getD1 } from "../../db";

export const SEED_POST = {
  id: 1,
  slug: "webdav-macos-folders",
  title: "맥에서 Synology WebDAV 폴더가 사라질 때 — 이름과 접속 주소를 바꾸지 않고 해결하기",
  category: "기술 가이드",
  summary:
    "DSM File Station이나 macOS SMB에서는 보이지만 macOS Finder WebDAV에서만 특정 폴더(Mac 등)가 사라지는 유니코드 NFC/NFD 정규화 길이 판별 버그의 원인 분석과, 저장 경로 변경 없이 역방향 프록시 및 게이트웨이로 해결한 기술 기록입니다.",
  coverImageUrl: "/guides/webdav-macos-folders/finder-after.png",
  status: "published",
  publishedAt: "2026-10-25 00:00:00",
  createdAt: "2026-10-25 00:00:00",
  updatedAt: "2026-10-25 00:00:00",
  body: `> **발행 정보**
> - **발행일:** 2026년 10월 25일
> - **오픈소스 저장소:** [GitHub: armsone/webdav-finder-compat](https://github.com/armsone/webdav-finder-compat)
> - **오프라인 문서:** [단일 HTML 파일 다운로드](/guides/webdav-macos-folders/community-guide.html)

---

### 선행 연구 인용 및 크레딧
본 해결책은 **Leo Nikkilä**의 선행 분석 및 Nginx Lua 아이디어([“Using Lua on Nginx to fix Finder's WebDAV quirks”, 2024-02-04](https://lnikki.la/posts/using-lua-on-nginx-to-fix-finders-webdav-quirks.html))에서 제안된 *‘PROPFIND href 경로의 NFD 실시간 보정’* 원리를 바탕으로, Synology DSM의 패키지 포트 특성과 Docker 환경에 맞춰 Python 비동기 프록시로 독립 구현한 것입니다. 독자적인 원천 기술이나 최초 발견으로 과장하지 않으며, 선행 연구자에게 깊은 감사를 표합니다.

**사실 구분 안내**
- **실측/검증됨:** 161개 메타데이터/목록 일관성 일치 (파일 전송 무결성 검증 아님), TLS 1.3 암호화 및 401 미인증 방어 동작 실측
- **사용자 확인:** 타 누락 위치 폴더 표시 확인
- **추론:** 공개 소스 분석·재현 증상·복구 기반 원인 추론 (현재 OS 바이너리/공식 확인 아님)
- **미측정/한계:** 앞단 Nginx 버퍼링 속도 미실측, 모든 폴더 무누락 보증 불가

---

## 1. 증상: 특정 폴더만 Finder에서 사라짐

Synology NAS를 WebDAV 프로토콜로 macOS Finder(네이티브 ‘서버에 연결’)에 마운트했을 때, 특이한 누락 현상이 관찰되었습니다.
동일한 계정으로 로그인했음에도 DSM **File Station**(웹)과 macOS 환경의 **SMB 공유** 마운트에서는 정상적으로 보이는 특정 폴더(\`Mac\`)가 macOS Finder 네이티브 WebDAV 마운트에서만 목록에 나타나지 않는 증상이었습니다.

### 재현 관찰 패턴
- **원본 상태:** \`#설치어플\` 폴더 안의 \`Mac\` 폴더가 Finder에서 누락 (숨김 항목을 포함한 원본 5개 raw 디렉토리 엔트리 중 4개만 수신되어 화면상 가시적 폴더 아이콘은 2개만 표시됨. 5개/4개 raw 목록 수와 가시적 아이콘 수를 동일시하지 마십시오).
- **이름 변경 실험:** \`Mac\`의 이름을 더 긴 이름으로 바꾸면 Finder에 즉시 나타남.
- **원복 실험:** 이름을 다시 \`Mac\`으로 되돌리면 즉시 Finder 목록에서 사라짐.

*실측/검증:* 실제 NAS의 디스크 저장 경로를 바꾸거나 폴더명을 강제로 긴 이름으로 고치지 않고, 기존 접속 주소와 포트(HTTPS 5006)를 유지하면서 문제를 해결하는 것이 목표였습니다.

### 검증 환경 스펙
| 구성 요소 | 버전 및 환경 | 비고 |
| :--- | :--- | :--- |
| NAS 하드웨어 | Synology DS1821+ | x86_64 아키텍처 |
| NAS 운영체제 (DSM) | DSM 7.4.1-90080 | 테스트 당시 설치 버전 (최신 버전 여부는 별도 검증하지 않음) |
| WebDAV Server 패키지 | 2.4.8-20135 | Synology 공식 패키지 |
| 클라이언트 OS | macOS 27.0.1 (Darwin) | 네이티브 WebDAVFS 마운터 |
| 보정 게이트웨이 환경 | Docker 24.0.2 / Python 3.11.17 / aiohttp 3.14.5 | 로컬 빌드 비동기 컨테이너 |

---

## 2. 원인 분석: 유니코드 NFC/NFD와 UTF-16 길이 비교의 함정

왜 다른 폴더(\`Android\`, \`Windows\`)는 잘 보이는데 유독 \`Mac\`만 사라졌을까요?
이 문제는 macOS의 네이티브 WebDAV 클라이언트인 [Apple 오픈소스 webdavfs의 webdav_parse.c](https://github.com/apple-oss-distributions/webdavfs/blob/a239d37d7407700119e9c92f66f38ab0a296cb0f/mount.tproj/webdav_parse.c#L1415-L1538) 소스 코드 구조와 재현 증상, 그리고 보정 후 복구 결과를 바탕으로 합리적으로 추론할 수 있습니다. (현재 macOS 상용 정식 바이너리 직접 검증이나 Apple 공식 확인 사항은 아닙니다.)

Finder가 WebDAV 폴더 목록을 요청할 때(\`PROPFIND\`), 자신이 마운트 중인 부모 경로를 macOS 기본 유니코드 형식인 **NFD (초성·중성·종성 분리형)**로 전송합니다. 반면 Synology WebDAV Server는 저장된 **NFC 형식(완성형)**으로 응답합니다.

공개된 \`webdavfs\` 소스 코드의 \`GetNormalizedPathLength\` 및 \`GetComponentName\` 함수는 URL 퍼센트 디코딩 후 \`CFStringGetLength\`(UTF-16 코드 유닛 개수)를 호출하여 부모 경로와 자식 항목의 경로 길이를 단순 비교합니다.
즉, **“응답으로 들어온 자식 경로의 길이가 요청한 부모 경로의 길이보다 엄격히 커야 한다”**는 전제로 자식 여부를 판별합니다.

### 경로 문자열의 UTF-16 길이 비교

[Unicode Standard Annex #15 (UAX #15)](https://www.unicode.org/reports/tr15/)에 정의된 NFC와 NFD 정규화 방식에 따라 부모 경로와 자식 경로의 실제 글자 수(UTF-16 코드 유닛)를 계산해 보면 다음과 같습니다:

| 항목 경로 | NFC 길이 (코드 유닛) | NFD 길이 (코드 유닛) | 판별 결과 (요청 부모 NFD 18자 대비) |
| :--- | :--- | :--- | :--- |
| 부모: \`/home/#설치어플/\` | 12 | **18** (기준 부모 길이) | macOS가 기억하는 요청 부모 길이: **18자** |
| 자식: \`/home/#설치어플/Mac/\` | **16** (Synology 응답) | 22 | **16 ≤ 18 → 탈락!** (자식이 부모보다 짧아 누락) |
| 자식: \`/home/#설치어플/Android/\` | **20** (Synology 응답) | 26 | **20 > 18 → 통과!** (정상 표시) |
| 자식: \`/home/#설치어플/Windows/\` | **20** (Synology 응답) | 26 | **20 > 18 → 통과!** (정상 표시) |
| **보정 후: \`/home/#설치어플/Mac/\`** | 16 | **22** (게이트웨이 NFD 변환) | **22 > 18 → 복구 성공!** (정상 표시) |

\`#설치어플\`은 한글 4글자가 포함되어 있어 NFD로 변환되면 길이가 12에서 18로 6글자 늘어납니다.
반면 자식 항목인 \`Mac\`은 3글자(영문)에 불과하여, 부모가 NFD(18자)인 상태에서 NFC 응답(16자)을 비교하면 **부모 경로 길이(18)보다 자식 경로 길이(16)가 더 짧다는 모순**이 발생하여 파서가 자식 항목을 유효하지 않은 것으로 간주하고 버렸던 것으로 추론됩니다.
\`Android\`나 \`Windows\`는 영문 철자가 길어 NFC 상태에서도 20글자가 되므로 18보다 커서 표시될 수 있었습니다.

---

## 3. 해결 구조: 무변형 저장과 실시간 NFD 응답 보정

핵심 해결 전략은 **“저장소의 원본 파일명과 폴더명은 절대 건드리지 않고, macOS 클라이언트의 요청 경로도 강제로 NFC로 역변환하지 않는 것”**입니다.
대신 중간 게이트웨이가 macOS WebDAVFS User-Agent의 \`PROPFIND\` 응답(HTTP 207 Multi-Status) XML 내부 중 \`DAV:multistatus/DAV:response/DAV:href\` 경로만 선택적으로 NFD로 변환하여 돌려줍니다.
보정된 207 응답에서는 XML 본문 변형에 따라 기존 \`ETag\`, \`Digest\`, \`Content-MD5\` 헤더가 제거되고 \`Content-Length\`가 정확히 재계산되며, 인증 정보(Auth) 및 \`LOCK\` 토큰을 비롯한 기타 WebDAV 속성은 온전하게 보존됩니다. (모든 HTTP 헤더가 무변형 유지된다고 주장하지 않습니다.)

### 아키텍처 설명 도해

![Synology WebDAV & 보정 게이트웨이 요청/응답 아키텍처](/guides/webdav-macos-folders/explanation.svg)

*(요청 흐름: Mac Finder → 기존 HTTPS 5006 → DSM 역방향 프록시 → 내부 게이트웨이 127.0.0.1:18080 → 기존 WebDAV HTTP 5005)*

### 스트리밍 및 버퍼링 동작 원리
- **일반 파일 송수신 (GET/PUT 등):** 보정 프로그램은 파일 다운로드나 업로드를 디스크에 임시 저장하지 않고 [aiohttp 스트리밍](https://docs.aiohttp.org/en/stable/client_reference.html) 방식으로 64KiB 조각(chunk) 단위로 즉시 흘려보냅니다.
- **디렉토리 목록 XML (PROPFIND 207 Multi-Status):** XML 태그 구조를 파싱해야 하므로 최대 10MiB(기본 \`WEBDAV_MAX_XML_SIZE=10485760\` 바이트) 메모리 상한 내에서만 응답 본문을 버퍼링하여 \`DAV:href\` 경로 문자열을 NFD로 실시간 치환합니다. 본문이 10MiB를 초과하거나 파싱할 수 없는 손상된(malformed) XML인 경우 데이터 왜곡을 막기 위해 명시적으로 실패 처리하며, NFD 변환 시 중복 href 충돌(collision)이 발생할 경우에도 \`502 Bad Gateway\`로 명시적 차단합니다.
- **인증과 보안:** 모든 계정 인증 및 읽기/쓰기 권한 판정은 기존 Synology WebDAV Server가 수행하며, 게이트웨이는 사용자 암호나 인증 토큰을 저장하지 않습니다.

---

## 4. 실제 복구 검증 및 스크린샷

보정 게이트웨이를 가동하고 DSM 역방향 프록시를 연결한 뒤, 클라이언트에서 기존 접속 주소(\`https://nas.example.com:5006/home/\`)로 다시 접속하여 실제 정상 동작을 확인했습니다.

### 복구 후 macOS Finder 화면
![복구 후 macOS Finder에서 Mac 폴더가 정상 표시된 실제 화면 스크린샷](/guides/webdav-macos-folders/finder-after.png)
*그림 1: 실제 복구 후 Finder 화면 (1978×1488 해상도). 숨김 항목을 제외한 3개의 보이는 폴더(Android, Mac, Windows) 중 사라졌던 Mac 폴더가 원래 이름 그대로 정상 표시되며 하위 항목 탐색도 정상 동작합니다.*

### 보정 게이트웨이 기동 및 401 방어 로그
![NAS 내부 보정 게이트웨이 정상 기동 및 401 미인증 방어 로그 실제 화면 스크린샷](/guides/webdav-macos-folders/gateway-health.png)
*그림 2: 실제 NAS 보정 게이트웨이 정상 기동 로그. 외부 미인증 PROPFIND 요청 시 기존 WebDAV 서버의 판단에 따라 즉시 401 Unauthorized로 인증을 요구하는 정상 방어 흐름을 확인할 수 있습니다.*

### 검증 관찰 데이터
- **기존 증상:** 문제 부모 폴더 내 숨김 항목을 포함한 원본 5개 raw 엔트리 중 네이티브 WebDAV 마운트 시 \`Mac\` 누락으로 4개만 반환됨 (화면상 가시적 폴더 아이콘은 2개만 표시).
- **보정 후:** \`Mac\` 폴더 정상 출현으로 숨김 항목 제외 3개의 보이는 폴더가 모두 정상 표시되고 하위 파일 목록 탐색 정상 동작.
- **메타데이터 및 디렉토리 목록 일치:** \`#설치어플\` 하위 총 161개 항목(폴더 36개, 파일 125개)의 디렉토리 목록 및 메타데이터 일관성 확인(누락 0건 / 추가 0건 / 정규화 충돌 0건). 단, 이는 목록 일관성 검증이며 파일 본문 전송 무결성(Transfer Integrity) 전수 검증을 의미하지는 않습니다.
- **사용자 확인:** 사용자가 지정한 다른 경로의 누락 문제 위치에서도 동일하게 폴더가 정상 복구됨을 확인.

---

## 5. 상세 설치 가이드 및 DSM 포트 예약 회피 절차

Synology DSM 환경에서 외부 공개 포트 5006을 역방향 프록시로 전환하려 할 때, 가장 중요한 부분은 **DSM의 비활성 포트 예약 잠금 현상**을 해소하는 절차입니다.

> ⚠️ **DSM 5006 포트 충돌 주의 (Synology 고유 동작)**
> Synology DSM의 WebDAV Server 패키지는 단순히 설정 화면에서 ‘HTTPS 활성화’ 체크를 끄기만 해도 내부 시스템에서 5006 포트의 예약을 해제하지 않고 유지합니다.
> 또한 체크가 꺼진 상태에서는 포트 입력창이 비활성화되어 포트 번호를 수정해도 실제로 저장되지 않습니다.
> 
> **해결 절차:** 반드시 WebDAV Server에서 HTTPS 활성화가 체크된 상태에서 포트 번호를 임의의 미사용 포트(예: \`18081\`)로 변경하고 [적용]을 누른 뒤, 저장이 완료되면 비로소 HTTPS 활성화 체크를 끄고 다시 [적용]해야 5006 포트가 완전히 풀려 역방향 프록시에서 사용할 수 있습니다.

### 단계별 설정 순서

1. **WebDAV Server 패키지 포트 변경 및 해제:**
   - DSM > **WebDAV Server** 패키지를 실행합니다.
   - HTTP 포트는 \`5005\` 활성화 상태(ON)를 유지합니다.
   - HTTPS 포트가 활성화(ON)된 상태에서 번호를 \`18081\`로 변경하고 [적용]합니다.
   - 적용이 끝나면 HTTPS 활성화 체크박스를 해제(OFF)하고 다시 [적용]합니다. (최종 상태: 직접 HTTPS 18081 OFF, 기존 HTTP 5005 ON)

2. **저장소 클론 및 Docker 로컬 빌드:**
   공개 배포된 별도의 Docker Hub 이미지가 없으므로, 소스 저장소를 클론하여 저장소의 \`docker-compose.yml\` 구성을 변경 없이 그대로 사용하여 로컬 빌드 및 구동합니다.
   (기본 설정: 컨테이너 이름 \`webdav-compat-gateway\`, 컨테이너 포트 \`8080\`을 호스트 루프백 \`127.0.0.1:18080:8080\`으로 매핑, XML 메모리 상한 \`WEBDAV_MAX_XML_SIZE=10485760\`(10MiB).)

\`\`\`bash
# 1) NAS 터미널에서 소스 저장소 클론 및 작업 디렉토리 이동
git clone https://github.com/armsone/webdav-finder-compat.git /volume1/docker/webdav-finder-compat
cd /volume1/docker/webdav-finder-compat

# 2) 환경 변수 파일 생성 (env.example 복사)
cp env.example .env

# 3) .env 설정 내용 확인 및 수정
# WEBDAV_PUBLIC_ORIGIN은 필수(REQUIRED) 값으로, 실제 클라이언트가 접속하는 정확한 HTTPS 스킴+도메인(호스트)+포트여야 합니다. (스킴, 호스트, 포트 불일치 시 macOS Finder의 COPY/MOVE 요청 처리 중 400 Bad Request 오류가 발생합니다.)
WEBDAV_UPSTREAM_URL=http://host.docker.internal:5005
WEBDAV_PUBLIC_ORIGIN=https://nas.example.com:5006

# 4) 저장소의 docker-compose.yml을 수정 없이 그대로 사용하여 빌드 및 백그라운드 실행
docker compose build && docker compose up -d
\`\`\`

3. **DSM 제어판 역방향 프록시(Reverse Proxy) 규칙 등록:**
   DSM 제어판 > **로그인 포털** > **고급** > **역방향 프록시**에서 새 규칙을 추가합니다:
   - **소스(Source):** 프로토콜 \`HTTPS\`, 호스트 이름 \`WEBDAV_PUBLIC_ORIGIN\`과 동일한 실제 접속 호스트(예: \`nas.example.com\`), 포트 \`5006\`
   - **대상(Destination):** 프로토콜 \`HTTP\`, 호스트 이름 \`127.0.0.1\`, 포트 \`18080\`

4. **DSM 인증서 할당 및 호스트 일치 확인 (필수):**
   역방향 프록시 규칙 추가 후, DSM 제어판 > **보안** > **인증서** > **설정**으로 이동하여 등록된 역방향 프록시 규칙(포트 5006)에 기존 공인 SSL 인증서가 올바르게 할당되었는지 확인합니다.

> 🔒 **네트워크 격리 및 방화벽 안전 수칙**
> [Docker 공식 포트 매핑 문서](https://docs.docker.com/engine/network/port-publishing/)에 따르면 Docker 28.0 미만 버전에서는 호스트의 동일 L2 로컬 서브넷에 있는 기기가 localhost 포트로 접근할 수 있는 잠재적 위험이 명시되어 있습니다.
> 따라서 \`127.0.0.1\` 매핑만으로 완전한 격리를 맹신하지 말고, **공유기(포트포워딩)나 방화벽에서 내부 HTTP 5005 및 게이트웨이 포트(18080)를 외부(WAN)로 절대 개방하지 않아야 합니다.** 오직 DSM의 공인 SSL 인증서가 적용된 HTTPS 5006 포트만 외부에 노출되어야 합니다.

---

## 6. 안전한 원복 (Rollback) 절차

본 구성은 Synology 원본 시스템의 Nginx 설정 파일이나 SSL 인증서 개인키를 직접 수정·복사하지 않는 비침습적 구조입니다.
기존 구성으로 되돌려야 할 때는 반드시 다음 순서를 지켜 포트 충돌을 방지합니다:

1. **역방향 프록시 규칙 비활성화 또는 삭제:**
   DSM 제어판 > 로그인 포털 > 고급 > 역방향 프록시에서 등록했던 \`5006\` 프록시 규칙을 먼저 비활성화하거나 삭제합니다. (이 작업을 먼저 해야 5006 포트 점유가 해제됩니다.)
2. **WebDAV Server HTTPS 원복:**
   WebDAV Server 패키지를 열고 HTTPS 활성화에 체크한 뒤, 포트를 \`18081\`에서 원래의 \`5006\`으로 되돌리고 [적용]합니다.
3. **Docker 컨테이너 중지:**
   실행 중인 \`webdav-compat-gateway\` 컨테이너를 중지(Stop)합니다.

*주의: 순서가 바뀌어 역방향 프록시가 5006을 잡고 있는 상태에서 WebDAV Server의 HTTPS 5006을 켜려고 하면 포트 충돌 오류가 발생합니다. 반드시 역방향 프록시를 먼저 해제하십시오.*

---

## 7. 성능 실측 미실시 및 기술적 한계 고지

투명하고 정직한 기술 공유를 위해 본 해결책 적용 시 인지해야 할 한계와 미확인 영역을 솔직히 밝힙니다:

- **미측정 - Nginx 업로드 버퍼링 및 전송 속도:**
  보정 게이트웨이 자체는 일반 파일을 64KiB 조각으로 스트리밍하지만, 앞단에 위치한 DSM 내장 Nginx 역방향 프록시의 [\`proxy_request_buffering\`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering) 기본 동작에 따라 대용량 업로드 시 Nginx 레벨에서의 버퍼링이 발생할 수 있습니다. 회선 속도 및 지연율에 대한 벤치마크 측정을 진행하지 않았으므로 *“전송 속도 저하 없음”*이나 *“무손실 동등 속도”*와 같은 주장은 하지 않습니다.
- **한계 - 전체 폴더 무누락 보증 불가:**
  전체 홈 폴더 전수 비교는 사용자의 지시로 제외되었습니다. 따라서 \`#설치어플\`(161개 항목) 및 확인된 위치 외에 모든 환경, 모든 DSM 버전, 모든 폴더 구조에서의 무누락을 보증하지 않습니다.
- **주의 - Apple 상용 OS 바이너리 미확인:**
  본 분석은 Apple이 공개한 오픈소스 \`webdavfs\`의 \`webdav_parse.c\` 소스 코드와 재현 증상을 바탕으로 한 추론입니다. macOS 상용 릴리즈의 바이너리 직접 검증이나 Apple 공식 버그 확인이 아님을 밝힙니다.
- **명시적 실패 - NFD 경로 충돌 시 502 Bad Gateway:**
  동일 디렉토리 내 서로 다른 파일·폴더가 NFD 정규화 시 동일한 href로 겹치는 비정상적 충돌(NFD href collision)이 발생하면, 임의로 데이터를 합치거나 조용히 누락하지 않고 \`502 Bad Gateway\`로 즉시 명시적 실패 처리합니다.
- **안전 설계 - 10MiB 초과 XML 및 손상 구문 명시적 실패:**
  PROPFIND XML 응답 크기가 메모리 상한인 10MiB(\`WEBDAV_MAX_XML_SIZE=10485760\` 바이트)를 초과하거나 파싱할 수 없는 손상된(malformed) XML인 경우, 불완전하게 잘라내지 않고 즉시 명시적 오류로 중단하여 데이터 무결성을 보호합니다.

---

## 8. 참고 문헌 및 자료 출처

1. **선행 연구:** Leo Nikkilä, *“Using Lua on Nginx to fix Finder's WebDAV quirks”* (2024-02-04), [https://lnikki.la/posts/using-lua-on-nginx-to-fix-finders-webdav-quirks.html](https://lnikki.la/posts/using-lua-on-nginx-to-fix-finders-webdav-quirks.html)
2. **Apple 오픈소스:** Apple Inc., *webdavfs — mount.tproj/webdav_parse.c (GetNormalizedPathLength / GetComponentName)*, [GitHub apple-oss-distributions/webdavfs](https://github.com/apple-oss-distributions/webdavfs/blob/a239d37d7407700119e9c92f66f38ab0a296cb0f/mount.tproj/webdav_parse.c#L1415-L1538)
3. **유니코드 정규화 표준:** Unicode Consortium, *Unicode Standard Annex #15: Unicode Normalization Forms (UAX #15)*, [https://www.unicode.org/reports/tr15/](https://www.unicode.org/reports/tr15/)
4. **Python 비동기 클라이언트:** aiohttp Contributors, *aiohttp Client Reference (Streaming & Auto-decompression)*, [https://docs.aiohttp.org/en/stable/client_reference.html](https://docs.aiohttp.org/en/stable/client_reference.html)
5. **Docker 포트 바인딩 보안:** Docker Documentation, *Docker Engine: Port publishing and mapping*, [https://docs.docker.com/engine/network/port-publishing/](https://docs.docker.com/engine/network/port-publishing/)
6. **Nginx 프록시 버퍼링:** Nginx Documentation, *Module ngx_http_proxy_module: proxy_request_buffering*, [https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering)

---

### 관련 링크
- [GitHub 오픈소스 저장소 열기 ↗](https://github.com/armsone/webdav-finder-compat)
- [단일 파일 문서 (.html) 다운로드 ↓](/guides/webdav-macos-folders/community-guide.html)
`,
};

export async function ensureSeedPost(): Promise<void> {
  const d1 = getD1();
  await d1
    .prepare(
      `INSERT OR IGNORE INTO blog_posts (
        id, slug, title, category, summary, body, cover_image_url,
        status, is_trashed, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
    )
    .bind(
      SEED_POST.id,
      SEED_POST.slug,
      SEED_POST.title,
      SEED_POST.category,
      SEED_POST.summary,
      SEED_POST.body,
      SEED_POST.coverImageUrl,
      SEED_POST.status,
      SEED_POST.publishedAt,
      SEED_POST.createdAt,
      SEED_POST.updatedAt
    )
    .run();
}
