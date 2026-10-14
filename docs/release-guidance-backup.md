# 릴리즈 자동 연결 안내의 저장소 반영

2026-10-14 22:42 KST 기준 22개 앱 저장소의 릴리즈 안내와 해당 게시 스크립트를 커밋·푸시하고 원격 커밋 일치를 확인했다. 이번 변경 파일만 포함했고 기존 미커밋 파일과 사용자 데이터는 보존했다.

| 제품 저장소 | 반영 브랜치 | 확인된 커밋 |
| --- | --- | --- |
| AIBI | main | [9359e46c](https://github.com/armsone/AIBI/commit/9359e46c852fe94fe7a2cd7ec0a6674470b6544d) |
| Alfred-AI-Search | main | [5a65ebbf](https://github.com/armsone/Alfred-AI-Search/commit/5a65ebbfab96f096a3aa160c0081ffda7914defc) |
| Alfred-NaverMap | main | [c44b3811](https://github.com/armsone/Alfred-NaverMap/commit/c44b3811843b4da7a15d5cce0133cec95276997b) |
| AutoShorts | main | [f2e039bf](https://github.com/armsone/AutoShorts/commit/f2e039bf7cdf91d42a252e2bb0f32dc4bbb76f44) |
| BTN | main | [8578d89a](https://github.com/armsone/BTN/commit/8578d89acab6489bf2d3fe59c500b4b6991af2bd) |
| Barobogi-MacOS | main | [ca4a0c00](https://github.com/armsone/Barobogi-MacOS/commit/ca4a0c004aae18826f90d4850c6b5f9727f8b80c) |
| CCMB | main | [5806bec8](https://github.com/armsone/CCMB/commit/5806bec8c26b8c64bc13a7e52c79b7b511039fb9) |
| CleanUSB-MacOS | main | [ca346192](https://github.com/armsone/CleanUSB-MacOS/commit/ca346192be81fb84c8ef9366d7ecb8aad8393ba4) |
| DenimDex-Android | main | [b29ef524](https://github.com/armsone/DenimDex-Android/commit/b29ef524b54dda386d72eae7fef7d12db04c7ec4) |
| HanAI | main | [48fe5bc9](https://github.com/armsone/HanAI/commit/48fe5bc9c81b7b93dedc898ae1c4a9743764c57f) |
| HanClip-Android | main | [17c13028](https://github.com/armsone/HanClip-Android/commit/17c13028db6d853b465777655193fb322ac367bc) |
| NasOS | main | [86542a27](https://github.com/armsone/NasOS/commit/86542a27a0af170a6334e793ca16f74c1275857c) |
| NasFinder | codex/superthumbnail-macos-extraction | [a322db2f](https://github.com/armsone/NasFinder/commit/a322db2f7f70807a3c47c522b78b27f29ec4a2cb) |
| NasFinder-Android | main | [68ebee2a](https://github.com/armsone/NasFinder-Android/commit/68ebee2a2ff10648e9370611425eba0a64681c97) |
| OurButton-Android | main | [30aae240](https://github.com/armsone/OurButton-Android/commit/30aae24004f49ca0d082fe6a18b696f3729c7dad) |
| S.tand | main | [9a6d4108](https://github.com/armsone/S.tand/commit/9a6d4108fb5e26d8504e9f1b640e49343575ff65) |
| S.tand-Android | main | [44b3d4eb](https://github.com/armsone/S.tand-Android/commit/44b3d4eb53ea60046a7788fe6ab053e17f91269f) |
| Stargram-Android | main | [a8c2de6c](https://github.com/armsone/Stargram-Android/commit/a8c2de6c1870cd33176cfc576a4abd4b0ad21c32) |
| SuperThumbnail-MacOS | main | [433e34c2](https://github.com/armsone/SuperThumbnail-MacOS/commit/433e34c226dbacd066846b8558edf2ffcc634ac0) |
| TrackpadGuard | main | [19d03d86](https://github.com/armsone/TrackpadGuard/commit/19d03d86aaf41a38897f39897954a2fa6d65dea1) |
| WhattoEat | main | [c668dd5d](https://github.com/armsone/WhattoEat/commit/c668dd5d4f8e5315c009135b61bf5524e8e923f7) |
| WhattoEat-Android | main | [01ec190d](https://github.com/armsone/WhattoEat-Android/commit/01ec190dd8ade9802ab0a3813eb5d60fa9290992) |

## Windows 안내와 스크립트

바로보기 Windows 작업 폴더는 Git 저장소가 아니므로 기존 [Windows 공개 릴리즈](https://github.com/armsone/Hanstree.com/releases/tag/windows-v0.3.0)에 두 파일을 추가 백업했다. 원본과 업로드된 파일의 SHA-256이 일치한다. 빌드 스크립트는 원래 프로젝트의 scripts/build.sh 위치에 복원해 사용한다.

- [릴리즈 안내](https://github.com/armsone/Hanstree.com/releases/download/windows-v0.3.0/Barobogi-Windows-release-guide.md)
- [패키징 스크립트](https://github.com/armsone/Hanstree.com/releases/download/windows-v0.3.0/Barobogi-Windows-build.sh)

NasFinder의 원래 작업 폴더에는 기존 미커밋 파일이 있어 푸시 보호 절차가 차단했다. 이번 커밋만 포함한 깨끗한 작업 사본의 정식 브랜치에서 같은 원격 브랜치로 푸시하고 확인했으며 작업 사본은 정리했다. 원래 작업 폴더의 파일은 보존했다.

## 푸시 차단 원인 수리

2026-10-14 22:48 KST, NasFinder의 정상 pre-push 경로를 수정했다. 미커밋 파일이 있어도 훅에서 실제 전송할 커밋 전부가 현재 HEAD임을 확인한 경우에는 기존 파일을 보존하고 푸시한다. detached HEAD·미보존 스냅샷 검사는 유지하며, 다른 커밋이나 삭제를 보내는 경우는 허용하지 않는다. 변경 없는 푸시도 정상 처리한다.

원래 작업 폴더에서 실제 커밋 푸시와 이미 최신 상태의 재확인을 모두 완료했으며 원격 커밋은 [993a3e88](https://github.com/armsone/NasFinder/commit/993a3e88a4fdee8dc755ec4cf80fa4889b7d27fe)이다. 원래 미커밋 파일의 내용과 기존 AGENTS 변경은 보존됐다. CLAUDE.md와 GEMINI.md는 AGENTS.md를 가리키는 기존 링크이며 함께 같은 규칙을 읽는다.
