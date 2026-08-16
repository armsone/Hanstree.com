export type Platform = {
  name: string;
  status: "공개" | "완료" | "개발 중" | "준비 중";
  detail: string;
  url?: string;
  downloadLabel?: string;
  checksum?: string;
  availabilityNote?: string;
};

export type AppData = {
  slug: string;
  name: string;
  english: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  theme: "violet" | "coral" | "amber" | "blue";
  icon?: string;
  artwork: "files" | "phones" | "clock" | "menubar" | "search" | "church";
  platforms: Platform[];
  features: { title: string; body: string }[];
  guide: { title: string; body: string }[];
  progress: { state: "done" | "active" | "next"; title: string; body: string }[];
  screenshots?: { src: string; alt: string; layout?: "phone" | "menu" | "landscape" | "wide" }[];
  github: string[];
  privacy: string[];
  matchup?: {
    metrics: { value: string; label: string }[];
    scope: string[];
    note: string;
  };
};

export const apps: AppData[] = [
  {
    slug: "nasfinder",
    name: "나스파인더",
    english: "NasFinder",
    eyebrow: "YOUR STORAGE, WITHIN REACH",
    tagline: "내 저장공간을, iPhone·iPad·Mac·Android에서.",
    summary: "iPhone·iPad·Apple Silicon Mac·Android에서 NAS와 원격 저장공간의 파일을 탐색하는 앱입니다. 대량 썸네일 작업을 위한 별도의 Mac 전용 생성기도 제공합니다.",
    theme: "violet",
    icon: "/apps/nasfinder/icon.png",
    artwork: "files",
    platforms: [
      { name: "iPhone · iPad", status: "완료", detail: "iOS 17+ · TestFlight 빌드 202608151322", availabilityNote: "TestFlight 배포 완료" },
      { name: "Mac용 NasFinder", status: "완료", detail: "Apple Silicon · iPhone·iPad 호환 앱", availabilityNote: "같은 TestFlight 빌드로 설치" },
      {
        name: "Mac용 썸네일 생성기",
        status: "공개",
        detail: "생성 전용 v1.0.0 · macOS 14+ · Apple Silicon",
        url: "https://github.com/armsone/NasFinder/releases/download/mac-super-thumbnail-v1.0.0/NasFinder-Super-Thumbnail-1.0.0.zip",
        downloadLabel: "Mac용 생성기 ZIP 바로 받기",
        checksum: "17820e7bded3c5a37d19042a99e5972eb7d512e097fbff5111fb3a1df5fe01ac",
      },
      {
        name: "Android",
        status: "공개",
        detail: "v2 APK",
        url: "https://github.com/armsone/NasFinder-Android/releases/download/android-v2/NasFinder-Android-v2.apk",
        downloadLabel: "Android APK 바로 받기",
        checksum: "b63038cd19a9094f75c700033f432cafdd98d7eb20e78e1e8de2ec7daecb5f44",
      },
    ],
    features: [
      { title: "여러 저장공간을 한곳에서", body: "Synology, SFTP, SMB, WebDAV, FTP와 Dropbox·OneDrive·Google Drive를 한 앱에서 탐색합니다." },
      { title: "사진과 영상을 먼저 보고", body: "썸네일, 전체화면 미리보기와 원격 영상 스트리밍으로 내려받기 전에 필요한 파일을 찾습니다." },
      { title: "파일 작업을 자연스럽게", body: "연결이 지원하는 범위에서 업로드, 폴더 생성, 이름 변경, 복사·이동·삭제까지 처리합니다." },
      { title: "기기 안에서 안전하게", body: "비밀번호와 로그인 토큰은 Keychain에, 받은 파일과 캐시는 앱 전용 저장공간에 보관합니다." },
      { title: "폰하드", body: "같은 Wi‑Fi의 컴퓨터에서 웹 브라우저만으로 iPhone에 파일을 보냅니다." },
      { title: "Apple 파일 앱 연동", body: "Synology와 SFTP 위치를 Apple 파일 앱에서도 익숙한 방식으로 사용합니다." },
      { title: "별도 Mac 썸네일 생성기", body: "NasFinder Mac 앱과 별개의 생성 전용 도구입니다. Mac에 연결한 NAS 폴더를 직접 읽어 대량의 사진·영상 썸네일을 빠르게 만들고 중단된 작업도 이어갑니다." },
    ],
    guide: [
      { title: "연결 추가", body: "서비스를 선택하고 서버 주소와 계정을 입력하거나 OAuth로 로그인한 뒤 연결을 확인합니다." },
      { title: "탐색과 미리보기", body: "보기 방식, 검색과 정렬을 선택하고 사진·영상·PDF·일반 문서를 앱 안에서 확인합니다." },
      { title: "받은 파일과 전송", body: "다른 앱의 공유 메뉴에서 받은 파일을 보관하고, 원하는 NAS 위치로 전송합니다." },
      { title: "데이터 관리", body: "연결 삭제, 받은 파일 삭제, 캐시 정리와 OAuth 연결 해제 방법을 안내합니다." },
      { title: "Mac 앱 설치", body: "공식 GitHub ZIP을 받아 압축을 풀고 NasFinder Super Thumbnail을 응용 프로그램으로 옮깁니다. Apple Developer ID 서명과 Apple 공증을 완료한 배포본입니다." },
      { title: "Mac에서 대량 작업", body: "Finder에서 NAS 공유 폴더를 먼저 연결한 뒤 Mac 전용 NasFinder Super Thumbnail에서 폴더를 선택합니다. 각 미디어 폴더의 .NasFinder-Vault에 iPhone과 호환되는 JPEG를 저장합니다." },
    ],
    progress: [
      { state: "done", title: "핵심 탐색과 미리보기", body: "다양한 원격 저장소 탐색, 미디어 썸네일과 미리보기 구현" },
      { state: "active", title: "실제 환경 검증", body: "서버별 파일 작업, 파일 앱 연동과 네트워크 예외를 검증 중" },
      { state: "next", title: "Google Photos Picker", body: "별도 OAuth로 사용자가 직접 선택한 사진·영상만 가져오는 흐름 준비" },
      { state: "done", title: "iPhone·iPad·Mac 지원", body: "iPhone과 iPad 앱 완성, 동일 앱의 Apple Silicon Mac 설치와 실행 검증" },
      { state: "done", title: "Android 공개", body: "NasFinder Android v2 APK를 GitHub Releases에 공개" },
      { state: "done", title: "Mac 전용 Super Thumbnail", body: "네이티브 Mac 앱에서 16,540개 미디어·1.57TB 폴더 검색, 진행률·용량·이어하기와 iPhone 호환 NAS 보관본 검증" },
    ],
    screenshots: [
      { src: "/apps/nasfinder/screens/android-home.png", alt: "나스파인더 Android 저장공간 홈" },
      { src: "/apps/nasfinder/screens/android-received.png", alt: "나스파인더 Android 받은 파일" },
      { src: "/apps/nasfinder/screens/android-add-connection.png", alt: "나스파인더 Android 연결 추가" },
      { src: "/apps/nasfinder/screens/android-thumbnail-cache.png", alt: "나스파인더 Android 썸네일 캐시 관리" },
      { src: "/apps/nasfinder/screens/android-theme.png", alt: "나스파인더 Android 테마와 앱 아이콘" },
      { src: "/apps/nasfinder/screens/android-super-thumbnail.png", alt: "나스파인더 Android Super Thumbnail" },
    ],
    github: ["https://github.com/armsone/NasFinder"],
    privacy: [
      "연결 정보는 앱 그룹에, 비밀번호·세션·OAuth 자격증명은 기기 전용 Keychain에 저장합니다.",
      "받은 파일, 다운로드 파일과 썸네일 캐시는 사용자의 기기 안에 저장됩니다.",
      "사용자가 선택한 외부 저장소 서비스와 직접 통신하며 각 서비스의 정책이 함께 적용됩니다.",
    ],
  },
  {
    slug: "hanclip",
    name: "한클립",
    english: "HanClip",
    eyebrow: "MOMENTS INTO A MOVIE",
    tagline: "고르는 순간부터, 한 편의 영화까지.",
    summary: "사진과 영상, Live Photo를 고르면 복잡한 편집을 줄여 한 편의 MP4 영화로 만드는 iPhone·iPad·Apple Silicon Mac·Android 앱입니다.",
    theme: "coral",
    icon: "/apps/hanclip/icon.png",
    artwork: "phones",
    platforms: [
      { name: "iOS · iPadOS", status: "개발 중", detail: "iOS 17 이상" },
      { name: "Mac", status: "준비 중", detail: "Apple Silicon · iPad 앱 호환 모드" },
      { name: "Android", status: "공개", detail: "APK v544", url: "https://github.com/armsone/HanClip-Android/releases/tag/android-v544" },
    ],
    features: [
      { title: "빠른 영화 만들기", body: "일상·여행·인생 기록과 골프 영상을 프리셋으로 시작하고 결과를 세밀하게 다듬습니다." },
      { title: "AiShot", body: "소리와 장면 변화를 참고해 필요한 순간을 자동으로 찾아 짧은 클립으로 남깁니다." },
      { title: "장면을 내 방식으로", body: "순서, 길이, 화면비, 자막과 음악, 워터마크와 엔딩 카드를 조절합니다." },
      { title: "사진부터 Live Photo까지", body: "사진·영상·Live Photo와 Android Motion Photo, 파일과 공유 항목을 가져옵니다." },
      { title: "시사회 후 결정", body: "완성된 영화를 먼저 확인한 뒤 다시 편집하거나 사진 앱·갤러리·파일로 저장합니다." },
      { title: "프로젝트 보관", body: "만들던 영화와 컬렉션을 저장해 다음에 이어서 작업할 수 있습니다." },
      { title: "Mac에서도 이어서", body: "Apple Silicon Mac에서 iPad 앱 호환 모드로 실행해 트랙패드와 키보드로 같은 영화 제작 흐름을 사용합니다." },
    ],
    guide: [
      { title: "프리셋 선택", body: "새 영화, 퀵모드, AiShot 또는 여행·인생·골프 프리셋에서 시작합니다." },
      { title: "미디어 가져오기", body: "사진첩·갤러리·달력·파일이나 다른 앱의 공유 메뉴에서 재료를 고릅니다." },
      { title: "편집과 만들기", body: "자동 묶음과 분할 결과를 확인하고 자막·음악·로고를 더해 영화를 만듭니다." },
      { title: "저장과 공유", body: "시사회에서 결과를 살핀 뒤 기기에 저장하거나 원하는 앱으로 공유합니다." },
    ],
    progress: [
      { state: "done", title: "iOS 핵심 제작 흐름", body: "선택, 편집, 렌더링, 시사회와 저장 흐름 구현" },
      { state: "done", title: "Android 공개 빌드", body: "GitHub Release를 통한 Android APK 배포" },
      { state: "active", title: "플랫폼 경험 정렬", body: "iOS와 Android의 기능과 화면 동등성을 계속 다듬는 중" },
      { state: "active", title: "Apple Silicon Mac 지원", body: "iPhone·iPad와 같은 빌드를 Mac의 ‘iPhone 및 iPad용 앱’으로 설치하는 흐름을 검증 중" },
      { state: "next", title: "현장 감도 검증", body: "다양한 영상과 실제 골프 환경에서 AiShot을 추가 검증" },
    ],
    screenshots: [
      { src: "/apps/hanclip/screens/ios-home.png", alt: "한클립 iOS 홈" },
      { src: "/apps/hanclip/screens/ios-add-media.png", alt: "한클립 iOS 미디어 추가" },
      { src: "/apps/hanclip/screens/android-quick-select.png", alt: "한클립 Android 퀵모드 사진 선택" },
      { src: "/apps/hanclip/screens/android-duration.png", alt: "한클립 Android 장면 길이 설정" },
      { src: "/apps/hanclip/screens/android-editor-pets.png", alt: "고양이와 강아지 사진으로 꾸민 한클립 Android 편집 화면" },
      { src: "/apps/hanclip/screens/android-home-dark.png", alt: "한클립 Android 다크 테마 홈" },
    ],
    github: ["https://github.com/armsone/HanClip", "https://github.com/armsone/HanClip-Android"],
    privacy: [
      "사용자가 고른 사진·영상·음원과 프로젝트 정보는 영화 제작을 위해 처리합니다.",
      "카메라와 마이크는 AiShot에서 순간을 감지하고 촬영할 때 사용합니다.",
      "기기에 내보낸 완성본은 앱을 삭제해도 남을 수 있으므로 사진 앱·갤러리에서 별도로 삭제해야 합니다.",
    ],
  },
  {
    slug: "stand",
    name: "S.tand",
    english: "S.tand",
    eyebrow: "A QUIET COMPANION AT NIGHT",
    tagline: "낮에는 오브제, 밤에는 조용한 케어.",
    summary: "플립시계와 날씨를 보여주는 오브제이자, 밤에는 움직임에 불빛으로 반응하고 수면 소리 후보를 기기 안에 기록하는 앱입니다.",
    theme: "amber",
    icon: "/apps/stand/icon.png",
    artwork: "clock",
    platforms: [
      { name: "iOS · iPadOS", status: "개발 중", detail: "주요 기능 구현" },
      {
        name: "macOS",
        status: "공개",
        detail: "0.30.0 · macOS 14+ · Apple 공증 완료",
        url: "https://github.com/armsone/S.tand/releases/download/macos-v0.30.0/S.tand-macOS-0.30.0.zip",
        downloadLabel: "Mac용 ZIP 바로 받기",
        checksum: "8d38c2f99cca96b4742c2f7e3ab2c325df3ee92b6da92ada0be7a7003b8f172e",
      },
      { name: "Android", status: "공개", detail: "APK v52", url: "https://github.com/armsone/S.tand-Android/releases/tag/android-v52" },
    ],
    features: [
      { title: "오브제 모드", body: "플립시계, 날씨와 배터리를 가로·세로 화면에 차분하게 표시합니다." },
      { title: "매이트와 화들짝", body: "어두운 환경에서 최소 밝기를 유지하고 움직임이나 큰소리에 화면과 조명이 반응합니다." },
      { title: "로컬 수면 기록", body: "코골이·잠꼬대·뒤척임 후보를 기기 안에 기록하고 타임라인으로 확인합니다." },
      { title: "내 화면 만들기", body: "밝기, 시계 글꼴과 배치, 테마를 화면 방향에 맞게 편집합니다." },
      { title: "보이소", body: "QR로 가까운 기기를 연결해 움직임과 소리 이벤트를 조용히 나눕니다." },
      { title: "라디오와 위젯", body: "인터넷 라디오를 듣고 위젯에서 원하는 모드로 빠르게 시작합니다." },
      { title: "재현 가능한 화면 매치업", body: "한국어·서울 시간대·고정 시각 조건에서 iOS와 Android의 공통 화면 상태를 같은 의미 ID로 캡처하고 비교합니다." },
    ],
    guide: [
      { title: "권한 선택", body: "카메라·마이크·대략적 위치를 왜 사용하는지 확인하고 필요한 권한만 허용합니다." },
      { title: "세 가지 모드", body: "오브제, 매이트와 화들짝 모드의 역할과 밝기·제스처를 익힙니다." },
      { title: "수면 기록", body: "날짜별 타임라인에서 후보 녹음을 듣고 병합·공유하거나 삭제합니다." },
      { title: "보이소 연결", body: "공간을 만들고 QR로 참여해 볼 사람·말할 사람 역할을 선택합니다." },
      { title: "Mac에서 시작", body: "공증된 ZIP을 내려받아 압축을 풀고 STand.app을 응용 프로그램 폴더로 옮긴 뒤 실행합니다. Developer ID 서명과 Apple 공증을 마쳐 macOS Gatekeeper 검증을 통과합니다." },
    ],
    progress: [
      { state: "done", title: "시계와 수면 케어", body: "오브제 화면, 반응형 조명과 로컬 수면 기록 구현" },
      { state: "done", title: "Android 공개 빌드", body: "GitHub Release를 통한 Android APK 배포" },
      { state: "active", title: "보이소 안정화", body: "근거리 연결, 재연결과 백그라운드 알림을 개선 중" },
      { state: "done", title: "Mac Catalyst 공개", body: "Developer ID 서명, Apple 공증과 Gatekeeper 검증을 마친 macOS 0.30.0 ZIP 공개" },
      { state: "active", title: "iOS·Android 화면 매치업", body: "15개 공통 상태를 자동 캡처하고 남은 아이콘·세부 기하 차이를 추적 중" },
      { state: "next", title: "장시간 실기기 검증", body: "오디오·센서 흐름과 접근성을 다양한 기기에서 추가 검증" },
    ],
    screenshots: [
      { src: "/apps/stand/screens/ios-home-portrait.png", alt: "S.tand iOS 세로 오브제 시계" },
      { src: "/apps/stand/screens/ios-sleep-report.png", alt: "S.tand iOS 수면 기록 리포트" },
      { src: "/apps/stand/screens/android-editor.png", alt: "S.tand Android 내 화면 편집" },
      { src: "/apps/stand/screens/ios-home-landscape-flat.png", alt: "S.tand iOS 가로 오브제 시계", layout: "landscape" },
      { src: "/apps/stand/screens/android-recordings.png", alt: "S.tand Android 잠소리 관리" },
      { src: "/apps/stand/screens/android-boyiso.png", alt: "S.tand Android 보이소 연결" },
      { src: "/apps/stand/screens/ios-clock-fonts.png", alt: "S.tand iOS 시계 글꼴 선택" },
    ],
    github: ["https://github.com/armsone/S.tand", "https://github.com/armsone/S.tand-Android"],
    privacy: [
      "수면 녹음은 앱 전용 저장공간에 보관되며 사용자가 공유할 때만 선택한 파일을 전달합니다.",
      "대략적 위치는 날씨를 가져올 때 사용하고, 카메라는 플래시와 주변 밝기 판단을 위해 사용합니다.",
      "의료용 진단 앱이 아니며 소리 분류 결과는 주변 환경에 따라 달라질 수 있습니다.",
    ],
    matchup: {
      metrics: [
        { value: "15", label: "iOS·Android 공통 상태" },
        { value: "2×", label: "Android 반복 해시 일치" },
        { value: "12", label: "iOS 정확 해시 안정 상태" },
      ],
      scope: [
        "첫 실행 권한과 홈 세로·가로·편집",
        "수면 리포트와 잠소리 관리",
        "보이소, 설정, 테마와 시계 글꼴",
        "인터넷 라디오 편집·삭제와 설정 복원",
        "폰트 저작권과 라이선스 전문",
      ],
      note: "기능·문구·주요 구조는 정렬했습니다. 플랫폼 고유 아이콘 경로와 일부 세부 색상·입력창·대화상자 기하, 추가 상태는 엄격 패리티의 후속 검증 항목입니다.",
    },
  },
  {
    slug: "ccmb",
    name: "CCMB",
    english: "CCMB",
    eyebrow: "CODEX AT A GLANCE",
    tagline: "Codex 사용량을 메뉴 막대에서 한눈에.",
    summary: "터미널을 열지 않고도 남은 Codex 주간 사용량과 크레딧 정보를 확인하는 비공식 macOS 메뉴 막대 앱입니다.",
    theme: "blue",
    artwork: "menubar",
    platforms: [
      { name: "macOS", status: "공개", detail: "v0.3.25 · macOS 10.15+", url: "https://github.com/armsone/CCMB/releases/tag/v0.3.25" },
    ],
    features: [
      { title: "메뉴 막대에서 바로", body: "남은 주간 사용량과 크레딧을 작업 흐름을 끊지 않고 확인합니다." },
      { title: "필요할 때 새로고침", body: "직접 새로고치거나 원하는 간격으로 자동 갱신하고 초기화 정보도 확인합니다." },
      { title: "로컬 공유", body: "최신성 근거가 포함된 로컬 JSON을 다른 앱과 Codex 대화에서 안전하게 읽습니다." },
      { title: "오프라인 복구", body: "네트워크 단절과 Mac의 잠자기·깨우기 이후에도 상태를 회복합니다." },
      { title: "서명된 자동 업데이트", body: "Sparkle과 GitHub Releases를 통해 서명된 새 버전을 확인하고 설치합니다." },
      { title: "로그인 시 시작", body: "선택하면 Mac 로그인과 함께 조용히 실행됩니다." },
    ],
    guide: [
      { title: "설치 준비", body: "macOS 10.15 이상과 현재 사용자로 로그인된 Codex CLI가 필요합니다." },
      { title: "DMG로 설치", body: "GitHub Release에서 DMG를 받아 앱을 Applications 폴더로 옮깁니다." },
      { title: "표시와 새로고침", body: "메뉴 막대 값과 상세 정보, 자동 새로고침 간격을 설정합니다." },
      { title: "다른 대화와 공유", body: "로컬 ccmb-usage 명령으로 최신성 여부가 포함된 사용량 정보를 확인합니다." },
    ],
    progress: [
      { state: "done", title: "공개 배포", body: "Universal DMG와 GitHub Releases 배포 흐름 제공" },
      { state: "done", title: "서명된 자동 업데이트", body: "Sparkle 기반 업데이트와 무결성 확인" },
      { state: "done", title: "로컬 사용량 공유", body: "다른 앱과 대화를 위한 최신성 포함 JSON 및 명령 제공" },
      { state: "active", title: "안정성 개선", body: "Codex 변화와 네트워크·절전 예외에 맞춰 지속 개선" },
    ],
    screenshots: [
      { src: "/apps/ccmb/screens/macos-menubar.png", alt: "CCMB macOS 메뉴 막대의 실제 사용량 표시", layout: "wide" },
      { src: "/apps/ccmb/screens/ccmb-usage-menu.png", alt: "CCMB macOS 사용량 메뉴와 새로고침 설정", layout: "menu" },
    ],
    github: ["https://github.com/armsone/CCMB"],
    privacy: [
      "현재 Mac 사용자의 Codex CLI 세션을 이용하며 API 키나 로그인 자격증명을 앱에 포함하지 않습니다.",
      "사용량 정보는 사용자의 Mac에서 표시되고, 앱 자체 분석이나 원격 측정 기능을 추가하지 않습니다.",
      "진단 로그의 문자열은 비공개로 처리하며 원시 요청과 응답 본문을 기록하지 않습니다.",
    ],
  },
  {
    slug: "intosharp",
    name: "인투샾",
    english: "intoSharp",
    eyebrow: "OPEN THE WEB BY NAME",
    tagline: "주소 대신 이름으로 여는 첫 화면.",
    summary: "검색과 자주 가는 사이트를 한 화면에 모으고, 사이트 이름과 검색어만으로 빠르게 이동하는 개인화 웹 시작 페이지입니다.",
    theme: "blue",
    icon: "/apps/intosharp/icon.png",
    artwork: "search",
    platforms: [
      { name: "Web", status: "공개", detail: "PC · 모바일 반응형", url: "https://intosharp.com/", downloadLabel: "인투샾 열기" },
    ],
    features: [
      { title: "이름으로 바로 이동", body: "주소를 외울 필요 없이 등록된 사이트 이름을 입력하면 해당 페이지를 바로 엽니다." },
      { title: "검색까지 한 줄에서", body: "네이버·Google·YouTube·지도·쇼핑을 고르고 검색어를 입력해 원하는 곳에서 바로 찾습니다." },
      { title: "자주 가는 곳을 한눈에", body: "일, 이야기마당, 볼거리, 연장 등 쓰임에 따라 나눈 이음말을 한 화면에서 확인합니다." },
      { title: "내 시작 화면으로", body: "검색 서비스와 밝고 어두운 화면을 기기에 기억해 다음 방문에도 이어서 사용합니다." },
    ],
    guide: [
      { title: "사이트 열기", body: "검색줄에 등록된 사이트 이름을 입력하고 Enter를 누르면 바로 이동합니다." },
      { title: "원하는 곳에서 검색", body: "검색 서비스를 선택한 뒤 검색어를 입력하거나 ‘네이버 우리집’처럼 이름과 검색어를 함께 씁니다." },
      { title: "이음말 둘러보기", body: "화면 아래의 분야별 카드에서 자주 쓰는 사이트를 찾아 엽니다." },
      { title: "첫 화면으로 사용", body: "브라우저의 시작 페이지나 홈 화면 바로가기에 인투샾을 등록해 사용합니다." },
    ],
    progress: [
      { state: "done", title: "공개 웹 서비스", body: "intosharp.com에서 PC와 모바일로 바로 이용 가능" },
      { state: "done", title: "통합 이동과 검색", body: "사이트 이름 이동과 서비스별 검색 문법 구현" },
      { state: "active", title: "개인화 관리", body: "이음말과 화면 구성을 더 편하게 관리하는 흐름을 다듬는 중" },
      { state: "next", title: "이음말 확장", body: "개인 시작 페이지에서 검증한 이름 기반 연결 경험을 확장" },
    ],
    github: [],
    privacy: [
      "선택한 검색 서비스와 화면 테마는 다음 방문을 위해 브라우저에 저장될 수 있습니다.",
      "검색을 실행하면 입력한 검색어가 사용자가 선택한 외부 검색 서비스로 전달되며 해당 서비스의 개인정보처리방침이 적용됩니다.",
      "관리 기능의 인증정보 원문은 공개 페이지 데이터에 저장하지 않습니다.",
    ],
  },
  {
    slug: "airchurch",
    name: "에어처치",
    english: "airChurch",
    eyebrow: "FAITH MEETS GOOD WILL",
    tagline: "좋은 말씀과 선한 마음이 만나는 곳.",
    summary: "검증한 교회의 설교와 찬양을 발견하고, 우리 교회를 응원하며, 가진 달란트로 이웃의 필요를 잇는 크리스천 웹 포털입니다.",
    theme: "coral",
    icon: "/apps/airchurch/icon.png",
    artwork: "church",
    platforms: [
      { name: "Web", status: "공개", detail: "PC · 모바일 반응형", url: "https://airchurch.net/", downloadLabel: "에어처치 열기" },
    ],
    features: [
      { title: "오늘의 말씀과 찬양", body: "교단 소속과 공식 채널을 확인한 교회의 최신 설교와 찬양을 한곳에서 발견합니다." },
      { title: "경쟁보다 발견", body: "목회자의 서열을 만들기보다 작은 교회와 지역의 꾸준한 사역이 발견되도록 보여줍니다." },
      { title: "착한나눔", body: "시간, 경험, 공간, 기술과 기도를 필요한 교회와 이웃에게 연결합니다." },
      { title: "서로를 지키는 광장", body: "개인정보를 최소화한 별칭으로 이야기를 나누고 운영 원칙에 따라 첫 글을 검토합니다." },
      { title: "분명한 검증 기준", body: "교단·노회·공식 홈페이지와 영상 채널을 교차 확인하고 신고·재검토·이의제기 절차를 둡니다." },
    ],
    guide: [
      { title: "말씀 찾기", body: "교회명, 목사님 또는 지역을 검색하고 공식 채널의 설교를 확인합니다." },
      { title: "찬양 듣기", body: "여러 교회의 최신 찬양을 둘러보고 공식 YouTube 영상으로 이어서 듣습니다." },
      { title: "교회 응원하기", body: "건강한 발견에 도움이 되도록 마음을 전하고, 지역별 교회를 살펴봅니다." },
      { title: "달란트 나누기", body: "도울 수 있는 일과 활동 지역을 남기면 공개 전 확인을 거쳐 실제 필요와 연결합니다." },
      { title: "광장 참여하기", body: "공동체 원칙을 확인하고 별칭으로 신앙과 삶의 이야기를 나눕니다." },
    ],
    progress: [
      { state: "done", title: "공개 웹 포털", body: "airchurch.net에서 PC와 모바일로 이용 가능" },
      { state: "done", title: "설교·찬양 발견", body: "공식 채널 기반 콘텐츠 검색과 지역 필터 구현" },
      { state: "active", title: "검증과 운영 안정화", body: "교회 정보 검토, 콘텐츠 동기화와 운영자 관리 흐름을 개선 중" },
      { state: "active", title: "착한나눔과 광장", body: "접수·검토·공개 절차와 안전 장치를 실제 운영에 맞춰 다듬는 중" },
    ],
    github: [],
    privacy: [
      "공개 콘텐츠를 둘러보는 데 회원 가입이나 개인 연락처 입력을 요구하지 않습니다.",
      "달란트 나눔과 광장에 사용자가 직접 입력한 내용은 접수와 공개 전 검토를 위해 처리합니다.",
      "외부 설교와 찬양을 열면 YouTube 등 해당 서비스의 개인정보처리방침이 적용됩니다.",
    ],
  },
];

export function findApp(slug: string) {
  return apps.find((app) => app.slug === slug);
}
