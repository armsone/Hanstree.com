import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("publishes AutoShorts with verified release and privacy facts", () => {
  const data = fs.readFileSync(new URL("../app/data.ts", import.meta.url), "utf8");
  const releases = fs.readFileSync(new URL("../app/releases.ts", import.meta.url), "utf8");

  assert.match(data, /slug: "autoshorts"/);
  assert.match(data, /0\.1\.2 · Manifest V3/);
  assert.match(data, /8a656529bd360a8c9ac022d8b12b8a3ab473f1d75c7c77b51209036c112b9cfd/);
  assert.match(data, /방문 기록, YouTube 시청 기록, 계정 정보와 영상 정보를 수집하거나 개발자 서버로 전송하지 않습니다/);
  assert.match(releases, /repo: "AutoShorts"/);
  assert.match(releases, /AutoShorts-0\.1\.2\.zip/);

  for (const asset of ["icon.png", "icon-card.webp", "home-card.webp", "autoshorts-hero.png"]) {
    assert.equal(fs.existsSync(new URL(`../public/apps/autoshorts/${asset}`, import.meta.url)), true, asset);
  }

  for (const index of [1, 2, 3, 4]) {
    const asset = `features/feature-${String(index).padStart(2, "0")}.webp`;
    assert.equal(fs.existsSync(new URL(`../public/apps/autoshorts/${asset}`, import.meta.url)), true, asset);
  }
});
