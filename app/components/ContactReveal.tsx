"use client";

import { useState } from "react";

export function ContactReveal() {
  const [visible, setVisible] = useState(false);
  const mailbox = ["arms", "one"].join("");
  const host = ["gmail", "com"].join(".");
  const address = `${mailbox}@${host}`;

  if (visible) {
    return <a className="button button-ghost-light" href={`mailto:${address}`} aria-live="polite">{address}</a>;
  }

  return <button className="button button-ghost-light" type="button" onClick={() => setVisible(true)}>직접 문의 보기</button>;
}
