import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("publishes AutoShorts with verified release and privacy facts", () => {
  const data = fs.readFileSync(new URL("../app/data.ts", import.meta.url), "utf8");
  const releases = fs.readFileSync(new URL("../app/releases.ts", import.meta.url), "utf8");

  assert.match(data, /slug: "autoshorts"/);
  assert.match(data, /0\.1\.1 · Manifest V3/);
  assert.match(data, /a0b1a9b2a9e6bea6eecfae755ff137367059a35a86b864bf3c7d38abfdd1bcdc/);
  assert.match(data, /방문 기록, YouTube 시청 기록, 계정 정보와 영상 정보를 수집하거나 개발자 서버로 전송하지 않습니다/);
  assert.match(releases, /repo: "AutoShorts"/);
  assert.match(releases, /AutoShorts-0\.1\.1\.zip/);

  for (const asset of ["icon.png", "icon-card.webp", "home-card.webp", "autoshorts-hero.png"]) {
    assert.equal(fs.existsSync(new URL(`../public/apps/autoshorts/${asset}`, import.meta.url)), true, asset);
  }
});
