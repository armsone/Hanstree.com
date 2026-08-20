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
  artwork: "files" | "phones" | "clock" | "menubar" | "trackpad" | "thumbnail" | "search" | "church";
  platforms: Platform[];
  features: { title: string; body: string; icon?: string }[];
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
    tagline: "NAS부터 움직이는 사진까지, 기기 경계 없이.",
    summary: "NAS·클라우드·네트워크 장비를 한곳에 연결하고 Super Thumbnail·VLC로 먼저 보고 재생하며, 파일 앱·폰하드·Live Photo↔Motion Photo 전송까지 이어가는 파일 앱입니다.",
    theme: "violet",
    icon: "/apps/nasfinder/icon.png",
    artwork: "files",
    platforms: [
      { name: "iPhone · iPad", status: "완료", detail: "1.1 (202608201901) · iOS·iPadOS 17+", availabilityNote: "TestFlight 업로드 완료" },
      { name: "Mac용 NasFinder", status: "완료", detail: "Apple Silicon · iPhone·iPad 호환 앱", availabilityNote: "같은 TestFlight 빌드로 설치" },
      {
        name: "Android",
        status: "공개",
        detail: "1.2 · APK v7 · Android 8.0+",
        url: "https://github.com/armsone/NasFinder-Android/releases/download/android-v7/NasFinder-Android-v7.apk",
        downloadLabel: "Android APK 바로 받기",
        checksum: "a4f43c3a5230be640b10c70ddf46295e20da7ca53679d266afe55875929baaca",
      },
    ],
    features: [
      { title: "여러 저장공간을 한곳에서", body: "Synology, SFTP, SMB, WebDAV, FTP와 Dropbox·OneDrive·Google Drive를 한 앱에서 탐색합니다." },
      { title: "Super Thumbnail과 VLC 미리보기", body: "Mac용 Super Thumbnail이 준비한 수퍼썸네일과 전체화면 미리보기, VLC 기반 원격 영상 재생으로 내려받기 전에 필요한 파일을 찾습니다." },
      { title: "Live Photos & Motion Photos", body: "사진·영상·Live Photo·Motion Photo를 함께 고르고 QR로 연결하면 상대 기기에 맞게 원본을 보존하거나 자동 변환해 사진 보관함에 저장합니다." },
      { title: "파일 작업을 자연스럽게", body: "연결이 지원하는 범위에서 업로드, 폴더 생성, 이름 변경, 복사·이동·삭제까지 처리합니다." },
      { title: "기기 안에서 안전하게", body: "Apple 기기는 Keychain, Android는 Keystore로 비밀번호와 로그인 토큰을 보호하고 받은 파일과 캐시는 앱 전용 저장공간에 보관합니다." },
      { title: "내 폰을 휴대용 하드로", body: "같은 Wi‑Fi의 컴퓨터에서 웹 브라우저만으로 iPhone·iPad 또는 Android 기기에 파일을 보내 휴대폰을 폰하드처럼 사용합니다.", icon: "/apps/nasfinder/phone-hard.png" },
      { title: "파일 앱에서 바로 가져오기", body: "iPhone·iPad의 파일 앱과 Android 시스템 파일 선택기에서 여러 파일을 골라 받은 파일함에 안전하게 복사합니다." },
      { title: "파일 앱의 강화된 미리보기", body: "iPhone·iPad에서는 Synology와 SFTP 위치를 Apple 파일 앱에서 열고 강화된 미리보기를 사용합니다. Android에서는 지원 연결을 시스템 파일 선택기의 NasFinder 위치로 엽니다." },
      { title: "안전한 앱 아이콘 변경", body: "Blue·Cyber Vault·Vibe Coder·Purple·네트워크 NAS 다섯 아이콘을 고를 수 있습니다. Android의 선택은 다음 앱 실행부터 안전하게 적용됩니다." },
    ],
    guide: [
      { title: "연결 추가", body: "서비스를 선택하고 서버 주소와 계정을 입력하거나 OAuth로 로그인한 뒤 연결을 확인합니다." },
      { title: "탐색과 미리보기", body: "보기 방식, 검색과 정렬을 선택하고 사진·영상·PDF·일반 문서를 앱 안에서 확인합니다." },
      { title: "받은 파일과 전송", body: "다른 앱의 공유 메뉴나 시스템 파일 선택기에서 가져온 파일을 보관하고, 원하는 NAS 위치로 전송합니다." },
      { title: "기기 간 미디어 전송", body: "보낼 미디어를 썸네일과 종류·영상 길이로 확인하고 필요 없는 항목을 뺀 뒤, 받을 기기의 QR을 스캔해 전송합니다. 받는 쪽은 QR만 표시하면 됩니다." },
      { title: "데이터 관리", body: "연결 삭제, 받은 파일 삭제, 캐시 정리와 OAuth 연결 해제 방법을 안내합니다." },
      { title: "앱 정보 확인", body: "설정에서 만든 사람과 공식 홈페이지를 확인하고, 오픈소스 구성요소는 실제 라이선스와 원문 링크가 있는 공개 페이지에서 살펴봅니다." },
    ],
    progress: [
      { state: "done", title: "핵심 탐색과 미리보기", body: "다양한 원격 저장소 탐색, 미디어 썸네일과 미리보기 구현" },
      { state: "active", title: "실제 환경 검증", body: "서버별 파일 작업, 파일 앱 연동과 네트워크 예외를 검증 중" },
      { state: "next", title: "Google Photos Picker", body: "별도 OAuth로 사용자가 직접 선택한 사진·영상만 가져오는 흐름 준비" },
      { state: "done", title: "iPhone·iPad·Mac 지원", body: "iPhone과 iPad 앱 완성, 동일 앱의 Apple Silicon Mac 설치와 실행 검증" },
      { state: "done", title: "Live Photo·Motion Photo 전송", body: "iPhone과 Android를 QR로 연결해 사진·영상·움직이는 사진의 원본 보존과 교차 변환 구현" },
      { state: "done", title: "Android 공개", body: "NasFinder Android v7 APK를 GitHub Releases에 공개" },
    ],
    screenshots: [
      { src: "/apps/nasfinder/screens/android-home.png", alt: "나스파인더 Android 저장공간 홈" },
      { src: "/apps/nasfinder/screens/android-received.png", alt: "나스파인더 Android 받은 파일" },
      { src: "/apps/nasfinder/screens/android-add-connection.png", alt: "나스파인더 Android 연결 추가" },
      { src: "/apps/nasfinder/screens/android-thumbnail-cache.png", alt: "나스파인더 Android 썸네일 캐시 관리" },
      { src: "/apps/nasfinder/screens/android-theme.png", alt: "나스파인더 Android 테마와 앱 아이콘" },
      { src: "/apps/nasfinder/screens/android-super-thumbnail.png", alt: "나스파인더 Android Super Thumbnail" },
    ],
    github: ["https://github.com/armsone/NasFinder", "https://github.com/armsone/NasFinder-Android"],
    privacy: [
      "Apple 앱은 연결 정보를 App Group에, 비밀번호·세션·OAuth 자격증명을 Keychain에 저장합니다. Android 앱은 자격증명을 Android Keystore로 보호한 기기 전용 저장공간에 보관합니다.",
      "받은 파일, 다운로드 파일과 썸네일 캐시는 사용자의 기기 안에 저장됩니다.",
      "기기 간 미디어 전송은 같은 로컬 네트워크에서 두 기기가 직접 연결되며 별도 중계 서버로 사진과 영상을 보내지 않습니다.",
      "사용자가 선택한 외부 저장소 서비스와 직접 통신하며 각 서비스의 정책이 함께 적용됩니다.",
    ],
  },
  {
    slug: "super-thumbnail",
    name: "수퍼썸네일 for Mac",
    english: "Super Thumbnail",
    eyebrow: "PREPARE ON MAC, BROWSE IN NASFINDER",
    tagline: "큰 미디어 폴더의 미리보기를, Mac에서 미리.",
    summary: "Finder에 연결한 NAS 또는 Mac 폴더를 직접 읽어 NasFinder와 호환되는 수퍼썸네일을 대량으로 만드는 macOS 전용 앱입니다.",
    theme: "violet",
    icon: "/apps/super-thumbnail/icon.png",
    artwork: "thumbnail",
    platforms: [
      {
        name: "macOS",
        status: "공개",
        detail: "v1.0.0 · macOS 14+ · Apple Silicon · Apple 공증 완료",
        url: "https://github.com/armsone/NasFinder/releases/download/mac-super-thumbnail-v1.0.0/NasFinder-Super-Thumbnail-1.0.0.zip",
        downloadLabel: "Mac용 ZIP 바로 받기",
        checksum: "17820e7bded3c5a37d19042a99e5972eb7d512e097fbff5111fb3a1df5fe01ac",
      },
    ],
    features: [
      { title: "대량 미디어 재귀 검색", body: "선택한 폴더 아래의 사진과 영상을 찾아 큰 NAS 미디어 보관함도 한 번에 확인합니다." },
      { title: "NasFinder와 바로 호환", body: "iPhone·iPad·Mac·Android NasFinder가 읽을 수 있는 JPEG 이름과 .NasFinder-Vault 저장 구조를 사용합니다." },
      { title: "중단 후 이어서", body: "이미 만든 썸네일은 건너뛰고 다시 검사하므로 긴 작업을 멈췄다가 안전하게 이어갈 수 있습니다." },
      { title: "진행 상태를 한눈에", body: "전체 파일 수, 완료 수, 예상 남은 시간, 확인한 원본 용량과 생성된 썸네일 용량을 표시합니다." },
      { title: "Mac에서 직접 처리", body: "파일을 개발자 서버로 보내지 않고 사용자가 선택한 Finder 폴더를 Mac에서 직접 읽고 씁니다." },
    ],
    guide: [
      { title: "앱 설치", body: "공식 ZIP을 받아 압축을 풀고 NasFinder Super Thumbnail을 응용 프로그램 폴더로 옮깁니다." },
      { title: "NAS 연결", body: "Finder에서 사용할 NAS 공유 폴더를 먼저 연결합니다. Mac 내부 미디어 폴더도 선택할 수 있습니다." },
      { title: "작업 폴더 선택", body: "앱에서 폴더 선택을 누르고 사진과 영상이 들어 있는 최상위 폴더를 고릅니다." },
      { title: "생성과 확인", body: "시작을 누르면 검색과 생성이 진행됩니다. 진행률과 용량, 남은 예상시간을 확인할 수 있습니다." },
      { title: "NasFinder에서 보기", body: "작업을 마친 뒤 NasFinder에서 같은 NAS 폴더를 열면 준비된 수퍼썸네일을 사용합니다." },
    ],
    progress: [
      { state: "done", title: "Mac 전용 네이티브 앱", body: "Finder 폴더 선택, 재귀 검색, 생성·일시정지·중단과 이어하기 구현" },
      { state: "done", title: "대규모 폴더 검증", body: "16,540개 미디어·1.57TB 폴더의 검색, 진행률과 용량 표시 검증" },
      { state: "done", title: "공개 배포", body: "Developer ID 서명과 Apple 공증을 마친 v1.0.0 ZIP 공개" },
      { state: "active", title: "다양한 NAS 환경 확인", body: "Finder 연결 방식과 파일 권한에 따른 예외를 계속 점검 중" },
    ],
    github: ["https://github.com/armsone/NasFinder"],
    privacy: [
      "사용자가 직접 선택한 Finder의 NAS 또는 Mac 폴더만 읽고 썸네일을 생성합니다.",
      "생성한 JPEG는 원본 폴더 안의 .NasFinder-Vault에 저장되며 개발자 서버로 전송하지 않습니다.",
      "마지막으로 선택한 폴더 경로는 다음 작업을 이어가기 위해 Mac의 앱 설정에 저장될 수 있습니다.",
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
      { name: "iOS · iPadOS", status: "완료", detail: "1.0.1 (3.11.55) · iOS·iPadOS 17+", availabilityNote: "TestFlight 업로드 완료" },
      { name: "Mac", status: "완료", detail: "Apple Silicon · iPad 앱 호환 모드", availabilityNote: "iPhone·iPad용 앱으로 지원" },
      {
        name: "Android",
        status: "공개",
        detail: "1.0.1 · APK v551 · Android 8.0+",
        url: "https://github.com/armsone/HanClip-Android/releases/download/android-v551/HanClip-Android-v551.apk",
        downloadLabel: "Android APK 바로 받기",
        checksum: "f548c579111041f09b3dc15c00c0a5781873789c97f350c13fcca1369c253132",
      },
    ],
    features: [
      { title: "빠른 영화 만들기", body: "실제 장면 수와 영상 분량에 맞춰 시간을 고르게 배분하고, 엔딩을 포함한 완성시간을 음악 길이에 맞춘 뒤 결과를 다듬습니다." },
      { title: "AiShot", body: "소리와 장면 변화를 참고해 필요한 순간을 자동으로 찾아 짧은 클립으로 남깁니다." },
      { title: "장면을 내 방식으로", body: "순서, 길이, 화면비, 자막과 음악, 워터마크와 엔딩 카드를 조절합니다." },
      { title: "사진부터 Live Photo까지", body: "사진·영상·Live Photo와 Android Motion Photo, 파일과 공유 항목을 가져옵니다." },
      { title: "시사회 후 결정", body: "완성된 영화를 먼저 확인한 뒤 다시 편집하거나 사진 앱·갤러리·파일로 저장합니다." },
      { title: "개봉영화 보관함", body: "새로 완성한 영화는 최대 30편까지 앱 안에 따로 보관하고 제목 수정, 재생, 공유와 제거를 할 수 있습니다." },
      { title: "프로젝트 보관", body: "만들던 영화와 컬렉션을 저장해 다음에 이어서 작업할 수 있습니다." },
      { title: "Mac에서도 이어서", body: "Apple Silicon Mac에서 iPad 앱 호환 모드로 실행해 트랙패드와 키보드로 같은 영화 제작 흐름을 사용합니다." },
      { title: "찾기 쉬운 테마와 저작권", body: "테마 설정을 카피라이트보다 먼저 보여주고, 긴 저작권 설명은 필요한 제목을 눌렀을 때만 펼쳐 봅니다. 워터마크 사용 여부도 한 줄 어디서나 쉽게 조작합니다." },
    ],
    guide: [
      { title: "프리셋 선택", body: "새 영화, 퀵모드, AiShot 또는 여행·인생·골프 프리셋에서 시작합니다." },
      { title: "미디어 가져오기", body: "사진첩·갤러리·달력·파일이나 다른 앱의 공유 메뉴에서 재료를 고릅니다." },
      { title: "편집과 만들기", body: "자동 묶음과 분할 결과를 확인하고 자막·음악·로고를 더해 영화를 만듭니다." },
      { title: "저장과 공유", body: "시사회에서 결과를 살핀 뒤 기기에 저장하거나 원하는 앱으로 공유합니다." },
    ],
    progress: [
      { state: "done", title: "iOS 핵심 제작 흐름", body: "선택, 편집, 렌더링, 시사회와 저장 흐름 구현" },
      { state: "done", title: "Android 공개 빌드", body: "HanClip Android v551 APK를 GitHub Releases에 공개" },
      { state: "active", title: "플랫폼 경험 정렬", body: "iOS와 Android의 기능과 화면 동등성을 계속 다듬는 중" },
      { state: "done", title: "Apple Silicon Mac 지원", body: "iPhone·iPad와 같은 빌드를 Mac의 ‘iPhone 및 iPad용 앱’으로 실행하도록 지원" },
      { state: "next", title: "현장 감도 검증", body: "다양한 영상과 실제 골프 환경에서 AiShot을 추가 검증" },
    ],
    screenshots: [
      { src: "/apps/hanclip/screens/ios-home.png", alt: "한클립 iOS 홈" },
      { src: "/apps/hanclip/screens/ios-add-media.png", alt: "한클립 iOS 미디어 추가" },
      { src: "/apps/hanclip/screens/android-quick-select.png", alt: "한클립 Android 퀵모드 사진 선택" },
      { src: "/apps/hanclip/screens/android-duration.png", alt: "한클립 Android 장면 길이 설정" },
      { src: "/apps/hanclip/screens/android-editor-pets.png", alt: "고양이와 강아지 사진으로 꾸민 한클립 Android 편집 화면" },
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
    summary: "플립시계와 날씨를 보여주는 오브제이자, 밤에는 움직임에 불빛으로 반응하고 수면 소리 후보를 기록합니다. Apple 기기에서는 Apple Music·인터넷 라디오를 앱 안에서, Android에서는 Spotify·YouTube Music을 연결해 듣습니다.",
    theme: "amber",
    icon: "/apps/stand/icon.png",
    artwork: "clock",
    platforms: [
      { name: "iOS · iPadOS", status: "완료", detail: "1.0.0 (0.32.6) · iOS·iPadOS 17+", availabilityNote: "TestFlight 업로드 완료" },
      {
        name: "macOS",
        status: "공개",
        detail: "0.30.0 · macOS 14+ · Apple 공증 완료",
        url: "https://github.com/armsone/S.tand/releases/download/macos-v0.30.0/S.tand-macOS-0.30.0.zip",
        downloadLabel: "Mac용 ZIP 바로 받기",
        checksum: "8d38c2f99cca96b4742c2f7e3ab2c325df3ee92b6da92ada0be7a7003b8f172e",
      },
      {
        name: "Android",
        status: "공개",
        detail: "0.0.1 · APK v57 · Android 8.0+",
        url: "https://github.com/armsone/S.tand-Android/releases/download/android-v57/S.tand-Android-v57.apk",
        downloadLabel: "Android APK 바로 받기",
        checksum: "9099aae7532bc18bd35345a6939a256740925f0c41215eb1c7730f204a1055b7",
      },
    ],
    features: [
      { title: "오브제 모드", body: "플립시계, 날씨와 배터리를 가로·세로 화면에 차분하게 표시합니다." },
      { title: "매이트와 화들짝", body: "어두운 환경에서 최소 밝기를 유지하고, 매이트 모드 진입 2분 뒤부터 움직임이나 큰소리에 화면과 조명이 반응합니다." },
      { title: "로컬 수면 기록", body: "코골이·잠꼬대·뒤척임 후보를 기기 안에 기록하고 타임라인으로 확인합니다." },
      { title: "내 화면 만들기", body: "밝기, 시계 글꼴과 배치, 테마를 화면 방향에 맞게 편집합니다. Mac에서는 음악 카드를 오른쪽 클릭해 순서를 바꾸거나 인터넷 라디오를 바로 수정합니다." },
      { title: "보이소", body: "QR로 가까운 기기를 연결해 움직임과 소리 이벤트를 조용히 나눕니다." },
      { title: "여섯 칸 음악 스트립", body: "로고 아래 한 줄의 음악 채널을 좌우로 넘깁니다. 휴대전화 가로 화면에서는 iPhone과 Android 모두 잠소리·보이소·설정을 오른쪽에 고정하고 남은 폭만 음악 스트립으로 사용합니다." },
      { title: "Apple Music 재생 제어", body: "Apple Music과 Classical의 재생 상태를 분리해 유지합니다. 왼쪽 아이콘은 재생·일시정지를 바꾸고, 제목은 멈춘 상태에서 재생하며 재생 중에는 다음 곡으로 넘깁니다." },
      { title: "선택하는 백그라운드 동작", body: "백그라운드 모드는 권한 설정에서 켜고 끕니다. 기본값은 꺼짐이며, 꺼진 상태에서는 다른 앱으로 나갈 때 감지와 재생을 멈춥니다." },
      { title: "재현 가능한 화면 매치업", body: "한국어·서울 시간대·고정 시각 조건에서 iOS와 Android의 공통 화면 상태를 같은 의미 ID로 캡처하고 비교합니다." },
    ],
    guide: [
      { title: "권한 선택", body: "카메라·마이크·대략적 위치를 왜 사용하는지 확인하고 필요한 권한만 허용합니다." },
      { title: "세 가지 모드", body: "오브제, 매이트와 화들짝 모드의 역할과 밝기·제스처를 익힙니다." },
      { title: "수면 기록", body: "날짜별 타임라인에서 후보 녹음을 듣고 병합·공유하거나 삭제합니다." },
      { title: "음악 채널", body: "Apple 기기에서는 Apple Music·Apple Music Classical과 인터넷 라디오 네 칸을, Android에서는 Spotify·YouTube Music과 인터넷 라디오 네 칸을 한 줄에서 좌우로 넘깁니다. 설정에서는 같은 여섯 칸의 순서와 라디오 이름·주소를 편집합니다." },
      { title: "백그라운드 모드", body: "권한 설정의 세그먼트에서 켜짐 또는 꺼짐을 선택합니다. 기본 꺼짐은 앱을 벗어날 때 감지·재생을 중지하고, 필요할 때만 직접 켭니다." },
      { title: "보이소 연결", body: "공간을 만들고 QR로 참여해 볼 사람·말할 사람 역할을 선택합니다." },
      { title: "Mac에서 시작", body: "공증된 ZIP을 내려받아 압축을 풀고 S.tand 앱을 응용 프로그램 폴더로 옮긴 뒤 실행합니다. Developer ID 서명과 Apple 공증을 마쳐 macOS Gatekeeper 검증을 통과합니다." },
    ],
    progress: [
      { state: "done", title: "시계와 수면 케어", body: "오브제 화면, 반응형 조명과 로컬 수면 기록 구현" },
      { state: "done", title: "Android 공개 빌드", body: "S.tand Android v57 APK를 GitHub Releases에 공개" },
      { state: "active", title: "보이소 안정화", body: "근거리 연결, 재연결과 백그라운드 알림을 개선 중" },
      { state: "done", title: "Mac Catalyst 공개", body: "Developer ID 서명, Apple 공증과 Gatekeeper 검증을 마친 macOS 0.30.0 ZIP 공개" },
      { state: "done", title: "휴대전화 가로 음악 배치", body: "iPhone 대표 가로 배치를 Android에도 적용하고 음악 스트립과 오른쪽 고정 제어 패널이 겹치지 않게 정리" },
      { state: "next", title: "장시간 실기기 검증", body: "오디오·센서 흐름과 접근성을 다양한 기기에서 추가 검증" },
    ],
    screenshots: [
      { src: "/apps/stand/screens/ios-home-portrait.png", alt: "Apple Music과 인터넷 라디오 스트립이 있는 S.tand iOS 세로 오브제 시계" },
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
      "Apple 기기의 Apple Music 기능은 사용자가 허용한 뒤 시스템 음악 플레이어와 MusicKit으로 현재곡·재생 상태, 보관함과 추천 항목을 조회합니다. S.tand는 Apple 계정의 로그인 정보나 암호를 저장하지 않습니다.",
      "의료용 진단 앱이 아니며 소리 분류 결과는 주변 환경에 따라 달라질 수 있습니다.",
    ],
    matchup: {
      metrics: [
        { value: "15", label: "iOS·Android 공통 상태" },
        { value: "11", label: "Android 실기기 카탈로그" },
        { value: "12", label: "iOS 정확 해시 안정 상태" },
      ],
      scope: [
        "첫 실행 권한과 홈 세로·가로·편집",
        "수면 리포트와 잠소리 관리",
        "보이소, 설정, 테마와 시계 글꼴",
        "인터넷 라디오 편집·삭제와 설정 복원",
        "폰트 저작권과 라이선스 전문",
      ],
      note: "기능·문구·주요 구조는 정렬했습니다. Android 실기기 카탈로그 11개 상태는 두 차례 모두 통과했으며, 트라이폴드 다중 디스플레이의 캡처 프레임 차이로 홈 세로 화면의 반복 해시는 후속 검증 항목입니다.",
    },
  },
  {
    slug: "ccmb",
    name: "CCMB",
    english: "CCMB",
    eyebrow: "AI USAGE AT A GLANCE",
    tagline: "Codex·Claude·Gemini·Grok 사용량을 메뉴 막대에서 한눈에.",
    summary: "터미널을 열지 않고도 Codex의 남은 주간 사용량·크레딧, Claude·Gemini의 세션·주간 사용량, Grok의 주간·월간 크레딧 정보를 함께 확인하는 비공식 macOS 메뉴 막대 앱입니다.",
    theme: "blue",
    artwork: "menubar",
    platforms: [
      { name: "macOS", status: "공개", detail: "v0.4.2 · macOS 10.15+ · Universal", url: "https://github.com/armsone/CCMB/releases/tag/v0.4.2", downloadLabel: "DMG 다운로드", checksum: "07dde1deab3aa041013ea7afa50d194c6be026296ee6a2fc06d0cb88749b0af6" },
    ],
    features: [
      { title: "네 AI를 한눈에", body: "Codex·Claude·Gemini·Grok의 사용량을 통일된 4열 링과 패널로 나란히 확인합니다." },
      { title: "Grok 크레딧 정보", body: "Grok 요금제, 월간 사용 크레딧, 주간 초기화 시각과 추가 사용 크레딧 잔액을 함께 표시합니다." },
      { title: "서비스별 새로고침", body: "네 서비스의 갱신 주기를 각각 선택하고, 다음 갱신까지 남은 시간을 확인합니다." },
      { title: "같은 모양의 두 패널", body: "메뉴 막대에서 여는 패널과 항상 보기 패널에 같은 정보·간격·하단 설정을 제공합니다." },
      { title: "배경 불투명도", body: "두 패널의 전체 배경 불투명도를 95%~100% 범위에서 수치를 보며 조절합니다." },
      { title: "정렬된 계정·갱신 정보", body: "네 서비스의 요금제·계정 정보·상대 갱신 시각을 같은 기준선에서 비교합니다." },
      { title: "로컬 공유", body: "최신성 근거가 포함된 로컬 JSON을 다른 앱과 Codex 대화에서 안전하게 읽습니다." },
      { title: "오프라인 복구", body: "네트워크 단절과 Mac의 잠자기·깨우기 이후에도 상태를 회복합니다." },
      { title: "서명된 자동 업데이트", body: "Sparkle과 GitHub Releases를 통해 서명된 새 버전을 확인하고 설치합니다." },
      { title: "로그인 시 시작", body: "선택하면 Mac 로그인과 함께 조용히 실행됩니다." },
    ],
    guide: [
      { title: "설치 준비", body: "macOS 10.15 이상과 로그인된 Codex CLI가 필요하며, Claude Code·Antigravity agy CLI·Grok CLI의 기존 로그인 정보도 읽기 전용으로 활용합니다." },
      { title: "DMG로 설치", body: "GitHub Release에서 DMG를 받아 앱을 Applications 폴더로 옮깁니다." },
      { title: "표시와 새로고침", body: "메뉴 막대 값과 상세 정보, 패널 배경 불투명도와 자동 새로고침 간격을 설정합니다." },
      { title: "다른 대화와 공유", body: "로컬 ccmb-usage 명령으로 최신성 여부가 포함된 사용량 정보를 확인합니다." },
    ],
    progress: [
      { state: "done", title: "공개 배포", body: "Universal DMG와 GitHub Releases 배포 흐름 제공" },
      { state: "done", title: "서명된 자동 업데이트", body: "Sparkle 기반 업데이트와 무결성 확인" },
      { state: "done", title: "로컬 사용량 공유", body: "다른 앱과 대화를 위한 최신성 포함 JSON 및 명령 제공" },
      { state: "done", title: "통합 사용량 패널", body: "메뉴 패널과 항상 보기의 레이아웃·설정 통합 및 배경 불투명도 조절" },
      { state: "active", title: "안정성 개선", body: "Codex·Claude·Gemini·Grok 변화와 인증·요청 제한·네트워크·절전 예외에 맞춰 지속 개선" },
    ],
    screenshots: [
      { src: "/apps/ccmb/screens/macos-menubar.png", alt: "CCMB macOS 메뉴 막대의 실제 사용량 표시", layout: "wide" },
      { src: "/apps/ccmb/screens/ccmb-usage-menu.png", alt: "Codex·Claude·Gemini·Grok 사용량 링과 갱신 그래프를 4열로 표시한 CCMB 메뉴", layout: "menu" },
    ],
    github: ["https://github.com/armsone/CCMB"],
    privacy: [
      "현재 Mac 사용자의 Codex CLI·Claude Code·Antigravity CLI·Grok CLI 로그인 세션을 이용하며 API 키나 로그인 자격증명을 앱에 포함하지 않습니다.",
      "사용량 정보는 사용자의 Mac에서 표시되고, 앱 자체 분석이나 원격 측정 기능을 추가하지 않습니다.",
      "진단 로그의 문자열은 비공개로 처리하며 원시 요청과 응답 본문을 기록하지 않습니다.",
    ],
  },
  {
    slug: "trackpadguard",
    name: "트랙패드가드",
    english: "TrackpadGuard",
    eyebrow: "TYPE WITHOUT THE CURSOR JUMP",
    tagline: "타이핑할 때는 잠그고, 원하는 곳을 터치해 다시 켜세요.",
    summary: "키 입력 중 트랙패드의 커서 이동·클릭·스크롤을 막고, 마지막 입력 1초 후 또는 지정한 물리적 영역을 터치하면 자동으로 해제하는 macOS 메뉴 막대 앱입니다.",
    theme: "blue",
    icon: "/apps/trackpadguard/icon.png",
    artwork: "trackpad",
    platforms: [
      { name: "macOS", status: "공개", detail: "v0.1.3 · macOS 13+ · Universal", url: "https://github.com/armsone/TrackpadGuard/releases/tag/v0.1.3", downloadLabel: "DMG 다운로드", checksum: "e4a1d568c3fbd63b51cdea9cb1a2e335f4cc8b9ab141e704f55d38a763a59644" },
    ],
    features: [
      { title: "키 입력과 동시에 잠금", body: "문자를 입력하기 시작하면 트랙패드의 커서 이동, 클릭과 스크롤을 바로 차단합니다." },
      { title: "1초 후 자동 해제", body: "마지막 키 입력 뒤 1초 동안 추가 입력이 없으면 트랙패드 잠금을 자동으로 해제합니다." },
      { title: "터치로 자연스럽게 해제", body: "기본 사다리꼴 또는 사용자가 정한 영역을 새로 터치하면 트랙패드가 즉시 다시 작동합니다." },
      { title: "눈으로 편집하는 영역", body: "설정 화면에서 네 꼭짓점을 직접 드래그해 손과 사용 습관에 맞는 해제 영역을 만듭니다." },
      { title: "실패 안전 설계", body: "멀티터치 좌표를 읽지 못하면 잠금을 시작하지 않으며, 긴급 단축키로 언제든 즉시 해제할 수 있습니다." },
      { title: "서명된 자동 업데이트", body: "Sparkle과 GitHub Releases를 통해 서명된 새 버전을 확인하고 설치합니다." },
      { title: "눈에 보이는 잠금 상태", body: "가드가 적용되면 메뉴 막대 아이콘이 빨간색으로 바뀌고 해제되면 원래 색으로 돌아옵니다." },
    ],
    guide: [
      { title: "앱 설치", body: "공식 GitHub Release의 DMG를 열고 TrackpadGuard를 Applications 폴더로 옮깁니다." },
      { title: "손쉬운 사용 권한", body: "시스템 설정의 개인정보 보호 및 보안에서 TrackpadGuard의 손쉬운 사용 권한을 허용합니다." },
      { title: "작동 영역 조절", body: "설정의 작동 영역 탭에서 초록색 꼭짓점을 드래그합니다. 기본값은 상단 1/3을 제거한 사다리꼴입니다." },
      { title: "타이핑과 자동 해제", body: "키를 누르면 아이콘이 빨간색으로 바뀌며 트랙패드가 잠깁니다. 마지막 입력 1초 후에는 자동으로 다시 작동합니다." },
      { title: "영역 터치로 바로 해제", body: "1초를 기다리지 않고 설정한 초록색 영역을 새로 터치해 즉시 잠금을 해제할 수도 있습니다." },
      { title: "다른 포인터 장치", body: "마우스·트랙볼·펜 태블릿을 이동하거나 클릭·스크롤하면 잠금이 즉시 해제됩니다." },
      { title: "긴급 해제", body: "영역 인식에 문제가 생기면 Control-Option-Command-Escape를 눌러 즉시 잠금을 해제합니다." },
    ],
    progress: [
      { state: "done", title: "입력 잠금과 터치 해제", body: "Quartz 이벤트 필터와 물리적 멀티터치 좌표 기반 해제 흐름 구현" },
      { state: "done", title: "자동 해제와 상태 표시", body: "마지막 키 입력 1초 후 자동 해제와 잠금 중 빨간 메뉴 막대 아이콘 구현" },
      { state: "done", title: "사다리꼴 기본 영역과 편집", body: "상단 1/3을 제거한 기본값, 네 꼭짓점 드래그와 설정 저장 구현" },
      { state: "done", title: "Universal 배포 기반", body: "Apple Silicon·Intel 앱 번들, DMG, Sparkle와 GitHub Release 관리 흐름 구성" },
      { state: "done", title: "서명·공증 배포", body: "Developer ID 서명, Apple 공증과 v0.1.3 DMG 공개 완료" },
      { state: "next", title: "macOS 호환성 관리", body: "macOS 업데이트마다 비공개 멀티터치 프레임워크 호환성을 확인" },
    ],
    screenshots: [
      { src: "/apps/trackpadguard/screens/usage-square.png", alt: "TrackpadGuard가 키보드 입력 중 트랙패드를 잠그고 초록 영역 터치로 해제되는 과정을 설명하는 그림", layout: "wide" },
    ],
    github: ["https://github.com/armsone/TrackpadGuard"],
    privacy: [
      "키 입력 내용은 저장하거나 전송하지 않고 키가 눌렸다는 상태만 잠금 시작에 사용합니다.",
      "트랙패드 접촉 좌표는 잠금 해제 영역 판정에만 사용하며 앱 밖으로 보내거나 기록하지 않습니다.",
      "앱 자체 분석, 광고 추적과 원격 측정 기능을 포함하지 않습니다.",
    ],
  },
  {
    slug: "htoms-brief",
    name: "HtOMS 브리프",
    english: "HtOMS Brief",
    eyebrow: "TODAY'S OMS, AT A GLANCE",
    tagline: "오늘의 매출과 서버 상태를, 한 페이지에서.",
    summary: "HtOMS의 실제 OMS 데이터를 읽어 오늘·이번 달 매출, 시간대·월간 추이, 출고 현황과 외부 서버 상태를 한 화면에 보여주는 iPhone·iPad용 읽기 전용 브리프 앱입니다.",
    theme: "blue",
    icon: "/apps/htoms-brief/icon.png",
    artwork: "files",
    platforms: [
      { name: "iOS · iPadOS", status: "완료", detail: "1.0 (202608210644) · iOS·iPadOS 17+", availabilityNote: "TestFlight 업로드 완료" },
    ],
    features: [
      { title: "실제 OMS 매출 데이터", body: "로그인한 계정으로 오늘·이번 달 매출과 시간대·월간 추이를 실제 API에서 읽어 표시합니다." },
      { title: "한 페이지 브리프", body: "오늘의 매출, 위치별 현황, 외부 서버 상태와 출고 현황을 세로 한 화면 흐름으로 확인합니다." },
      { title: "10분 자동 갱신", body: "다음 갱신까지 남은 시간을 역타이머로 보여주고 0초가 되면 자동으로 다시 가져옵니다. 화면을 누르면 즉시 갱신합니다." },
      { title: "외부 서버 이상 표시", body: "장항·인천·삼송·초월 서버는 평소 회색, 문제가 생기면 빨간색으로 바뀝니다." },
      { title: "안전한 로그인", body: "아이디와 비밀번호는 Apple Keychain으로 보호하며 앱 화면과 저장 데이터에 원문을 노출하지 않습니다." },
      { title: "홈 화면 위젯", body: "앱에서 갱신한 핵심 브리프를 iPhone·iPad 홈 화면에서도 빠르게 확인합니다." },
    ],
    guide: [
      { title: "로그인", body: "회사 OMS 계정으로 로그인하면 실제 조회 권한에 따라 브리프 데이터를 가져옵니다." },
      { title: "한 화면에서 확인", body: "오늘의 매출 아래 위치별 현황과 서버 상태를 보고, 이어서 매출 추이와 출고 현황을 확인합니다." },
      { title: "즉시 갱신", body: "다음 자동 갱신까지 남은 시간이 표시되며, 기다리지 않고 화면을 눌러 바로 새로 가져올 수 있습니다." },
    ],
    progress: [
      { state: "done", title: "실제 OMS 연동", body: "로그인, 매출·출고·위치·외부 서버 데이터 조회 구현" },
      { state: "done", title: "한 페이지 대시보드", body: "분리됐던 정보를 한 화면의 읽기 흐름으로 통합" },
      { state: "done", title: "자동·수동 갱신", body: "10분 역타이머와 터치 즉시 갱신 구현" },
      { state: "done", title: "iPhone·iPad 검증", body: "공통 빌드와 실제 iPhone 설치·실행 검증" },
    ],
    screenshots: [
      { src: "/apps/htoms-brief/screens/login.png", alt: "HtOMS 브리프의 사내 계정 로그인과 Keychain 안내 화면" },
    ],
    github: ["https://github.com/armsone/HtOMS-BK"],
    privacy: [
      "OMS 로그인 자격증명은 Apple Keychain으로 보호하며 홈페이지나 앱의 일반 설정에 원문으로 저장하지 않습니다.",
      "앱은 업무 현황 확인을 위한 읽기 전용 API 요청만 수행하며 주문을 생성하거나 변경하지 않습니다.",
      "화면에는 매출·출고 집계와 서버 상태를 표시하고 개별 주문의 개인정보를 별도로 보관하지 않습니다.",
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
  {
    slug: "starmanager",
    name: "스타메니저",
    english: "StarManager",
    eyebrow: "YOUR STORY, READY TO SHARE",
    tagline: "오늘의 이야기를, 내 목소리로 완성합니다.",
    summary: "전하고 싶은 이야기를 적고 스타일·분위기·글자 수를 고르면, 설정한 말투와 기준에 맞는 소셜 게시물 초안을 만들고 사진·영상과 함께 공유하는 iPhone·iPad·Android 앱입니다.",
    theme: "violet",
    icon: "/apps/starmanager/icon.png",
    artwork: "phones",
    platforms: [
      { name: "iPhone · iPad", status: "완료", detail: "0.1.0 (1) · iOS·iPadOS 18+", availabilityNote: "TestFlight 업로드 완료" },
      {
        name: "Android",
        status: "공개",
        detail: "0.1.0 · APK v0.1.0 · Android 8.0+",
        url: "https://github.com/armsone/StarManager-Android/releases/download/v0.1.0/StarManager-Android-v0.1.0.apk",
        downloadLabel: "Android APK 바로 받기",
        checksum: "b2d525ee6a17113b77efc046c6da1f782b9625d3946bc5920c5c27fc915c368f",
      },
    ],
    features: [
      { title: "한 문장부터 게시물까지", body: "오늘 전하고 싶은 생각을 적으면 선택한 스타일과 분위기, 이야기 비중을 반영해 정해진 글자 수의 초안을 만듭니다." },
      { title: "네 가지 말투", body: "MZ·X·386·꼰대 스타일과 따뜻하게·재치 있게·담백하게 분위기를 조합해 같은 이야기도 다른 결로 표현합니다." },
      { title: "내 목소리와 프리셋", body: "주제·독자·말투·이모지와 세부 어조를 저장하고 자주 쓰는 설정은 프리셋으로 다시 불러옵니다." },
      { title: "글자 수를 정확하게", body: "한글과 이모지를 실제 글자 단위로 세어 목표 길이와 해시태그·마무리 기준을 함께 검증합니다." },
      { title: "AI를 바로 선택", body: "지원 기기에서는 Apple AI로 바로 만들고, ChatGPT·Gemini·Grok에는 완성된 요청문을 보내 결과를 다시 가져올 수 있습니다." },
      { title: "미디어와 공유", body: "사진·영상을 최대 10개까지 담아 순서를 바꾸거나 삭제하고, 미리보기 뒤 문구 자동 복사와 iOS 공유 화면으로 Instagram 게시를 준비합니다." },
    ],
    guide: [
      { title: "이야기 입력", body: "만들기 탭에서 오늘 전하고 싶은 이야기와 스타일·분위기·비중·글자 수를 고릅니다." },
      { title: "초안 만들기", body: "Apple AI 버튼으로 기기에서 바로 만들거나 ChatGPT·Gemini·Grok으로 요청문을 보냅니다." },
      { title: "결과 확인", body: "목표 글자 수와 구성 기준을 확인하고, 외부 결과가 있으면 후보끼리 비교해 사용할 문장을 고릅니다." },
      { title: "미디어 추가", body: "사진·영상 또는 카메라로 미디어를 추가하고 순서와 대표 항목, 미리보기 화면비를 정합니다." },
      { title: "공유", body: "초안이 현재 설정과 일치하는지 확인한 뒤 캡션과 미디어를 원하는 앱으로 공유합니다." },
    ],
    progress: [
      { state: "done", title: "iPhone·iPad 원본 분석", body: "실제로 도달 가능한 만들기·내 설정 화면과 상태·문구·동작을 소스 기준으로 정리" },
      { state: "done", title: "Android 구현과 실기기 검증", body: "휴대전화·태블릿 반응형 화면, 생성·검증·미디어·설정 흐름 구현과 테스트 완료" },
      { state: "done", title: "첫 공개 APK", body: "검증된 Android 0.1.0 APK를 GitHub Releases에 공개" },
      { state: "done", title: "iPhone 실기기 설치", body: "대표 iPhone에 0.1.0 (1) 설치와 실행 확인" },
      { state: "active", title: "TestFlight 처리", body: "0.1.0 (1) 업로드 완료, Apple의 빌드 처리 결과 대기" },
      { state: "next", title: "시각 매치업 보강", body: "동일한 iOS·Android 무손실 캡처가 준비되면 화면별 시각 차이를 추가 검증" },
    ],
    screenshots: [
      { src: "/apps/starmanager/screens/ios-composer.png", alt: "스타메니저 iPhone 만들기 화면" },
      { src: "/apps/starmanager/screens/android-composer.png", alt: "스타매니저 Android 만들기 화면" },
      { src: "/apps/starmanager/screens/android-result.png", alt: "스타매니저 Android 게시물 생성 결과" },
    ],
    github: ["https://github.com/armsone/StarManager-Android"],
    privacy: [
      "프로필, 프리셋과 작성 설정은 사용자의 기기 안에 저장합니다.",
      "Apple AI를 사용할 수 있는 기기에서는 글 생성이 기기 안에서 처리됩니다.",
      "ChatGPT·Gemini·Grok을 선택하면 사용자가 확인한 프롬프트를 해당 외부 앱으로 공유하며 각 서비스의 개인정보처리방침이 적용됩니다.",
      "사용자가 고른 사진과 영상은 미리보기와 공유를 위해 앱 전용 임시 공간에서 처리합니다.",
    ],
    matchup: {
      metrics: [
        { value: "02", label: "도달 가능한 탭" },
        { value: "04", label: "글쓰기 스타일" },
        { value: "10", label: "미디어 최대 개수" },
      ],
      scope: [
        "만들기와 내 설정의 화면 구조·옵션·상태 흐름을 iOS 소스 기준으로 구현",
        "브랜드 색상과 AI 로고 원본, 프로필 마이그레이션과 글자 수 검증 규칙을 동일하게 적용",
        "휴대전화 세로 화면과 600dp 이상 태블릿의 2열 레이아웃을 각각 제공",
      ],
      note: "소스와 결정적 테스트 기준 구현은 완료했습니다. 동일 조건의 최신 iOS 무손실 캡처가 없어 픽셀 단위 시각 패리티는 아직 검증하지 않았습니다.",
    },
  },
];

export function findApp(slug: string) {
  return apps.find((app) => app.slug === slug);
}
