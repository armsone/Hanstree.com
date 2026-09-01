import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../page";

export const metadata: Metadata = {
  title: "한스트리 스튜디오 — 골프에서 시작해 다시 만드는 곳",
  description: "220인치 스크린 골프를 중심으로 일과 놀이, 운동과 회복이 이어지는 한스트리의 개인 창작 공간을 소개합니다.",
  alternates: { canonical: "https://hanstree.com/space/hanstree" },
  openGraph: {
    title: "한스트리 스튜디오 — 골프에서 시작해 다시 만드는 곳",
    description: "창의성과 체력을 함께 채우고, 다음 디지털 제품을 만드는 Hanstree의 공간 프로젝트입니다.",
    url: "https://hanstree.com/space/hanstree",
    images: [{ url: "/hanstree/screen-art.jpg", width: 1448, height: 1086, alt: "한스트리 스튜디오의 220인치 스크린 골프 공간" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "한스트리 스튜디오 — 골프에서 시작해 다시 만드는 곳",
    description: "창의성과 체력을 함께 채우는 Hanstree의 개인 창작 공간",
    images: ["/hanstree/screen-art.jpg"],
  },
};

const experiences = [
  {
    number: "01",
    label: "THE CENTER",
    title: "몸과 생각을 함께 움직이는 골프",
    copy: "한스트리 스튜디오의 중심은 골프존 비전플러스와 220인치 대형 스크린입니다. 집중해서 스윙하고 몸을 움직이는 시간은 막힌 생각을 환기하고 다시 작업으로 돌아갈 힘을 만듭니다.",
  },
  {
    number: "02",
    label: "PLAY & INSPIRE",
    title: "노래와 영화, 게임으로 시야를 바꾸기",
    copy: "TJ 노래방, Apple TV와 다양한 OTT, PlayStation 5와 레트로 게임기가 한 공간에 이어집니다. 같은 대형 스크린은 골프장이 되었다가 영화관과 무대가 됩니다.",
  },
  {
    number: "03",
    label: "MAKE",
    title: "네 대의 PC에서 생각을 결과로",
    copy: "네 대의 PC와 넓은 작업·회의 탁자에서 아이디어를 구상하고 실제 제품으로 만듭니다. NasFinder를 비롯한 Hanstree의 디지털 결과물이 이곳에서 시작됩니다.",
  },
  {
    number: "04",
    label: "MOVE & RECOVER",
    title: "꾸준히 만들기 위한 체력과 회복",
    copy: "러닝머신과 샤워 시설, 편안한 휴식 환경을 갖추고 있습니다. 부드러운 조명과 강력한 환기·공기청정, 냉난방, 방음과 출입 보안이 오랫동안 몰입할 수 있는 바탕이 됩니다.",
  },
];

const gallery = [
  { src: "/hanstree/screen-art.jpg", alt: "한스트리 스튜디오의 220인치 스크린 골프", caption: "01 · GOLF — 공간의 중심, 골프존 비전플러스와 220인치 스크린." },
  { src: "/hanstree/lounge-art.jpg", alt: "한스트리 스튜디오의 올리브 라운지", caption: "02 · LOUNGE — 움직인 뒤 앉아서 이야기하고 생각을 정리하는 자리." },
  { src: "/hanstree/golf-gear-art.jpg", alt: "한스트리 스튜디오의 골프 장비", caption: "03 · READY — 마음이 움직이면 바로 스윙을 시작할 수 있는 준비." },
  { src: "/hanstree/identity-art.jpg", alt: "한스트리 스튜디오의 상징과 전경", caption: "04 · HANSTREE STUDIO — 좋아하는 활동과 만드는 일이 한곳에 모인 공간." },
  { src: "/hanstree/karaoke-art.jpg", alt: "한스트리 스튜디오의 TJ 노래방", caption: "05 · SING — 큰 화면과 방음 설계가 만드는 마음 편한 작은 무대." },
  { src: "/hanstree/cinema-art.jpg", alt: "한스트리 스튜디오의 220인치 영화관", caption: "06 · CINEMA — 같은 화면이 골프장을 지나 조용한 영화관으로." },
  { src: "/hanstree/workstations-art.jpg", alt: "한스트리 스튜디오의 PC 네 대 작업 공간", caption: "07 · MAKE — 네 대의 PC에서 생각을 실제 디지털 결과물로." },
  { src: "/hanstree/meeting-art.jpg", alt: "한스트리 스튜디오의 넓은 회의 탁자", caption: "08 · THINK — 넓은 탁자 위에서 함께 펼쳐 보고 다듬는 생각." },
  { src: "/hanstree/billiards-art.jpg", alt: "한스트리 스튜디오의 당구 공간", caption: "09 · RESET — 잠깐 다른 움직임에 집중하며 머리를 환기하는 시간." },
  { src: "/hanstree/piano-art.jpg", alt: "한스트리 스튜디오의 디지털 피아노", caption: "10 · PLAY — 손과 귀로 리듬을 바꾸는 조용한 음악 코너." },
  { src: "/hanstree/treadmill-art.jpg", alt: "스크린 골프 옆 한스트리 스튜디오의 러닝머신", caption: "11 · MOVE — 스윙과 달리기로 꾸준히 만들 수 있는 체력을 채웁니다." },
  { src: "/hanstree/games-art.jpg", alt: "한스트리 스튜디오의 플레이스테이션 5와 레트로 게임", caption: "12 · GAME — 최신 게임과 오래된 게임을 오가며 시선을 전환합니다." },
  { src: "/hanstree/camp-kitchen-art.jpg", alt: "한스트리 스튜디오의 캠핑 테이블과 라면 조리 공간", caption: "13 · CAMP TABLE — 실내에서도 캠핑하듯 라면을 끓이고 잠시 쉬는 자리." },
  { src: "/hanstree/bedroom-art.jpg", alt: "퀸사이즈 침대 두 대와 대형 프로젝터가 있는 한스트리 스튜디오 침실", caption: "14 · REST — 퀸사이즈 침대 두 대와 큰 화면, 네 명이 편히 쉬는 방." },
  { src: "/hanstree/shower-art.jpg", alt: "한스트리 스튜디오의 강한 수압 샤워 시설", caption: "15 · REFRESH — 운동 뒤 몸과 리듬을 산뜻하게 되돌리는 샤워." },
  { src: "/hanstree/comfort-art.jpg", alt: "한스트리 스튜디오의 조명 환기 공기청정 냉난방과 방음 설비", caption: "16 · COMFORT — 조명·환기·공기청정·냉난방·방음·보안이 지키는 몰입." },
];

export default function HanstreeSpacePage() {
  return (
    <main className="hanstree-space-page">
      <SiteHeader />

      <section className="space-hero shell">
        <div className="space-hero-copy reveal">
          <Link className="breadcrumb" href="/#works">← 한스트리가 만든 것들</Link>
          <p className="eyebrow">SPACE PROJECT · HANSTREE STUDIO</p>
          <h1>골프를 치고,<br />새로운 에너지를 얻어<br /><span>다시 만드는 곳.</span></h1>
          <p>창의력은 머리만으로 유지되지 않습니다. 한스트리 스튜디오는 좋아하는 활동으로 몸과 생각을 환기하고, 그 힘을 실제 결과물로 이어가기 위해 직접 구성한 개인 창작 공간입니다.</p>
        </div>
        <div className="space-hero-image reveal">
          <Image src="/hanstree/screen-art.jpg" alt="한스트리 스튜디오의 대형 스크린 골프 공간" width={1448} height={1086} priority sizes="(max-width: 920px) 100vw, 58vw" />
          <div><span>GOLFZON VISION PLUS</span><strong>220인치 대형 스크린</strong></div>
        </div>
      </section>

      <section className="space-manifesto">
        <div className="shell">
          <p className="eyebrow">WHY THIS PLACE EXISTS</p>
          <h2>좋아하는 것을 오래,<br />더 잘하기 위해.</h2>
          <p>골프를 중심으로 노래와 영화, 게임, 운동과 휴식이 이어지고 그 한가운데에서 작업합니다. 놀이는 작업의 반대가 아니라 새로운 생각을 준비하는 과정이고, 체력은 생각을 끝까지 결과로 만드는 힘입니다.</p>
        </div>
      </section>

      <section className="space-experiences shell">
        <div className="space-section-heading">
          <p className="eyebrow">ONE PLACE, ONE RHYTHM</p>
          <h2>움직이고, 즐기고,<br />집중하고, 회복합니다.</h2>
        </div>
        <div className="space-experience-grid">
          {experiences.map((experience) => (
            <article key={experience.number}>
              <div><span>{experience.number}</span><small>{experience.label}</small></div>
              <h3>{experience.title}</h3>
              <p>{experience.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-gallery-section">
        <div className="shell">
          <div className="space-section-heading">
            <p className="eyebrow">INSIDE HANSTREE STUDIO</p>
            <h2>지금의 한스트리.</h2>
            <p>실제 공간의 기록을 바탕으로 사람과 개인정보는 덜어내고, 회색 벽과 녹색 바닥, 캠핑 올리브의 한 가지 화풍으로 다시 그렸습니다. 제대로 촬영한 사진이 준비되면 같은 이야기를 실제 모습으로 이어갑니다.</p>
          </div>
          <div className="space-gallery">
            {gallery.map((image) => (
              <figure key={image.src}>
                <Image src={image.src} alt={image.alt} width={1024} height={768} sizes="(max-width: 720px) 100vw, 50vw" />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="space-instagram-section">
        <div className="shell space-instagram-shell">
          <div className="space-instagram-image reveal">
            <Image src="/instagram/meoktamja-hero.jpeg" alt="먹기를 탐하는 자, 먹탐자 Instagram 대표 이미지" width={960} height={638} sizes="(max-width: 920px) 100vw, 52vw" />
          </div>
          <div className="space-instagram-copy reveal">
            <p className="eyebrow">WORK 21 · INSTAGRAM</p>
            <h2>먹탐자</h2>
            <p className="space-instagram-english">Instagram · @armsone</p>
            <p>먹기를 탐하는 자. 음식과 일상의 순간을 쌓아 온 공개 기록을 한스트리 안에서 모아 봅니다. 사진을 누르면 Instagram 원본으로 이어집니다.</p>
            <Link className="button button-primary" href="/space/hanstree/instagram">게시물 모아보기 <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="space-origin shell">
        <div>
          <p className="eyebrow">FROM SPACE TO PRODUCT</p>
          <h2>이 공간에서<br />NasFinder가 이어집니다.</h2>
        </div>
        <div>
          <p>한스트리 스튜디오에서 발견하고 다듬은 생각은 화면 안의 제품으로 이어집니다. 나스파인더는 내 저장공간을 모든 기기에서 연결하고, 일상의 불편을 직접 해결하기 위해 만든 대표 디지털 결과물입니다.</p>
          <Link className="button button-primary" href="/apps/nasfinder">NasFinder 보기 <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
