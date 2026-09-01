import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../page";

export const metadata: Metadata = {
  title: "Han’s Tree — 골프에서 시작해 다시 만드는 곳",
  description: "220인치 스크린 골프를 중심으로 일과 놀이, 운동과 회복이 이어지는 한스트리의 개인 창작 공간을 소개합니다.",
  alternates: { canonical: "https://hanstree.com/space/hanstree" },
  openGraph: {
    title: "Han’s Tree — 골프에서 시작해 다시 만드는 곳",
    description: "창의성과 체력을 함께 채우고, 다음 디지털 제품을 만드는 Hanstree의 공간 프로젝트입니다.",
    url: "https://hanstree.com/space/hanstree",
    images: [{ url: "/hanstree/screen.jpg", width: 1024, height: 768, alt: "Han’s Tree의 220인치 스크린 골프 공간" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Han’s Tree — 골프에서 시작해 다시 만드는 곳",
    description: "창의성과 체력을 함께 채우는 Hanstree의 개인 창작 공간",
    images: ["/hanstree/screen.jpg"],
  },
};

const experiences = [
  {
    number: "01",
    label: "THE CENTER",
    title: "몸과 생각을 함께 움직이는 골프",
    copy: "Han’s Tree의 중심은 골프존 비전플러스와 220인치 대형 스크린입니다. 집중해서 스윙하고 몸을 움직이는 시간은 막힌 생각을 환기하고 다시 작업으로 돌아갈 힘을 만듭니다.",
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
  { src: "/hanstree/screen.jpg", alt: "Han’s Tree의 220인치 스크린", caption: "골프 · 영화 · 노래가 하나의 큰 화면에서 이어집니다." },
  { src: "/hanstree/lounge.jpg", alt: "Han’s Tree의 라운지", caption: "움직인 뒤 앉아서 이야기하고 다시 생각을 정리하는 자리입니다." },
  { src: "/hanstree/golf-gear.jpg", alt: "Han’s Tree의 골프 장비", caption: "공간의 중심은 언제든 바로 시작할 수 있는 스크린 골프입니다." },
  { src: "/hanstree/sign.jpg", alt: "Han’s Tree의 나무 모양 표식", caption: "공간과 제품을 함께 만드는 Hanstree의 시작점입니다." },
];

export default function HanstreeSpacePage() {
  return (
    <main className="hanstree-space-page">
      <SiteHeader />

      <section className="space-hero shell">
        <div className="space-hero-copy reveal">
          <Link className="breadcrumb" href="/#works">← 한스트리가 만든 것들</Link>
          <p className="eyebrow">SPACE PROJECT · HAN’S TREE</p>
          <h1>골프를 치고,<br />새로운 에너지를 얻어<br /><span>다시 만드는 곳.</span></h1>
          <p>창의력은 머리만으로 유지되지 않습니다. Han’s Tree는 좋아하는 활동으로 몸과 생각을 환기하고, 그 힘을 실제 결과물로 이어가기 위해 직접 구성한 개인 창작 공간입니다.</p>
        </div>
        <div className="space-hero-image reveal">
          <Image src="/hanstree/screen.jpg" alt="Han’s Tree의 대형 스크린 골프 공간" width={1024} height={768} priority sizes="(max-width: 920px) 100vw, 58vw" />
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
            <p className="eyebrow">INSIDE HAN’S TREE</p>
            <h2>지금의 한스트리.</h2>
            <p>현재 공개된 기록 사진을 임시로 사용했습니다. 공간을 새로 촬영하면 같은 자리에 더 선명한 모습으로 교체합니다.</p>
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

      <section className="space-origin shell">
        <div>
          <p className="eyebrow">FROM SPACE TO PRODUCT</p>
          <h2>이 공간에서<br />NasFinder가 이어집니다.</h2>
        </div>
        <div>
          <p>Han’s Tree에서 발견하고 다듬은 생각은 화면 안의 제품으로 이어집니다. 나스파인더는 내 저장공간을 모든 기기에서 연결하고, 일상의 불편을 직접 해결하기 위해 만든 대표 디지털 결과물입니다.</p>
          <Link className="button button-primary" href="/apps/nasfinder">NasFinder 보기 <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
