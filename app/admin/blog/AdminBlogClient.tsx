"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BlogMarkdown } from "../../blog/BlogMarkdown";

type Post = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  coverImageUrl: string | null;
  status: "draft" | "published";
  isTrashed: number | boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function AdminBlogClient() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState("armsone");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Post management state
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "trash">("all");
  const [search, setSearch] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Editor state
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [editorTab, setEditorTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorNotice, setEditorNotice] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Check authentication
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/testflight/login", { cache: "no-store" });
      const data = await response.json();
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  // Load posts
  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("filter", filter);
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`/api/admin/blog?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingPosts(false);
    }
  }, [filter, search]);

  useEffect(() => {
    if (authenticated) {
      void loadPosts();
    }
  }, [authenticated, loadPosts]);

  // Login submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/testflight/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "로그인할 수 없습니다.");
        return;
      }
      setAuthenticated(true);
      setPassword("");
    } catch {
      setAuthError("서버와 통신할 수 없습니다.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Open editor for new post
  const handleNewPost = () => {
    setEditingPost({
      title: "",
      slug: "",
      category: "기술 가이드",
      summary: "",
      body: "",
      coverImageUrl: "",
      status: "draft",
      isTrashed: 0,
    });
    setIsNew(true);
    setIsDirty(false);
    setEditorError(null);
    setEditorNotice(null);
    setEditorTab("edit");
  };

  // Open editor for existing post
  const handleEditPost = async (postId: number) => {
    setSaving(true);
    setEditorError(null);
    setEditorNotice(null);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.post) {
        setEditingPost(data.post);
        setIsNew(false);
        setIsDirty(false);
        setEditorTab("edit");
      } else {
        alert(data.error || "글을 불러올 수 없습니다.");
      }
    } catch {
      alert("글을 불러오지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // Close editor
  const handleCloseEditor = () => {
    if (isDirty && !confirm("저장하지 않은 변경사항이 있습니다. 나가시겠습니까?")) {
      return;
    }
    setEditingPost(null);
    setIsNew(false);
    setIsDirty(false);
    setEditorError(null);
    setEditorNotice(null);
    void loadPosts();
  };

  // Save post
  const handleSave = async (statusOverride?: "draft" | "published") => {
    if (!editingPost) return;
    const targetStatus = statusOverride || editingPost.status || "draft";
    setSaving(true);
    setEditorError(null);
    setEditorNotice(null);

    const payload = {
      title: editingPost.title,
      slug: editingPost.slug,
      category: editingPost.category,
      summary: editingPost.summary,
      body: editingPost.body,
      coverImageUrl: editingPost.coverImageUrl,
      status: targetStatus,
    };

    try {
      const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${editingPost.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditorError(data.error || "저장에 실패했습니다.");
        return;
      }
      setIsDirty(false);
      if (isNew) {
        setIsNew(false);
        setEditingPost((prev) => (prev ? { ...prev, ...data.post, body: data.post.body ?? prev.body } : data.post));
        setEditorNotice(targetStatus === "published" ? "글이 발행되었습니다!" : "임시저장되었습니다!");
      } else {
        setEditingPost((prev) => (prev ? { ...prev, ...data.post, body: data.post.body ?? prev.body, status: targetStatus } : null));
        setEditorNotice(targetStatus === "published" ? "글이 발행되었습니다!" : "저장되었습니다!");
      }
      void loadPosts();
    } catch {
      setEditorError("서버와 통신할 수 없습니다.");
    } finally {
      setSaving(false);
    }
  };

  // Soft trash or restore
  const handleTrashToggle = async (post: Post | Partial<Post>, action: "trash" | "restore") => {
    if (!post.id) return;
    const confirmMsg =
      action === "trash"
        ? "이 글을 휴지통으로 이동하시겠습니까? (방문자에게 표시되지 않습니다)"
        : "이 글을 복구하시겠습니까?";
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        if (editingPost && editingPost.id === post.id) {
          setEditingPost(null);
        }
        void loadPosts();
      } else {
        const data = await res.json();
        alert(data.error || "작업을 수행하지 못했습니다.");
      }
    } catch {
      alert("서버와 통신할 수 없습니다.");
    }
  };

  // Auto slug generation from title
  const handleAutoSlug = () => {
    if (!editingPost?.title) return;
    const generated = editingPost.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9가-힣-_]/g, "")
      .slice(0, 80);
    setEditingPost((prev) => (prev ? { ...prev, slug: generated } : null));
    setIsDirty(true);
  };

  // Textarea toolbar formatting helpers
  const insertTextAtCursor = (before: string, after = "") => {
    const textarea = bodyTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;
    const selected = current.substring(start, end);
    const replacement = `${before}${selected || "내용"}${after}`;
    const nextValue = current.substring(0, start) + replacement + current.substring(end);

    setEditingPost((prev) => (prev ? { ...prev, body: nextValue } : null));
    setIsDirty(true);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + replacement.length - after.length);
    }, 0);
  };

  // Image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!editingPost?.id) {
      alert("이미지를 올리기 전에 먼저 임시저장해 주세요.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("JPEG, PNG, WebP 이미지 파일만 업로드할 수 있습니다.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하여야 합니다.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("postId", String(editingPost.id));

      const res = await fetch("/api/admin/blog/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "이미지 업로드에 실패했습니다.");
        return;
      }

      const markdownImage = `\n![${file.name.replace(/\.[^.]+$/, "")}](${data.url})\n`;
      insertTextAtCursor(markdownImage);
    } catch {
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Loading screen
  if (authenticated === null) {
    return (
      <div className="shell blog-shell" style={{ paddingBlock: "80px", textAlign: "center" }}>
        <p>관리자 환경을 확인하고 있습니다...</p>
      </div>
    );
  }

  // Unauthenticated: Login Screen
  if (authenticated === false) {
    return (
      <div className="shell admin-shell" style={{ paddingBlock: "60px" }}>
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="admin-login-head">
              <p className="eyebrow">블로그 관리자</p>
              <h1>블로그 관리 로그인</h1>
              <p className="admin-login-sub">글 작성과 편집을 위해 관리자 인증이 필요합니다.</p>
            </div>
            <form className="admin-login-form" onSubmit={handleLogin}>
              <div className="admin-form-group">
                <label htmlFor="admin-blog-id">관리자 아이디</label>
                <input
                  id="admin-blog-id"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="admin-blog-pw">비밀번호</label>
                <input
                  id="admin-blog-pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              {authError && <div className="admin-error-banner" role="alert">{authError}</div>}
              <button
                type="submit"
                className="button button-primary admin-login-btn"
                disabled={authLoading}
              >
                {authLoading ? "확인 중..." : "관리자 로그인 →"}
              </button>
            </form>
            <div className="admin-login-footer">
              <Link href="/admin">← 사이트 관리자 대시보드</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: Editor View
  if (editingPost) {
    return (
      <div className="shell blog-shell" style={{ paddingBlock: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <button
            type="button"
            className="blog-pagination-btn"
            onClick={handleCloseEditor}
          >
            ← 목록으로 돌아가기
          </button>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {isDirty && (
              <span style={{ fontSize: "0.82rem", color: "var(--accent, #a74628)", fontWeight: 600 }}>
                ● 저장되지 않은 변경사항
              </span>
            )}
            <button
              type="button"
              className="blog-pagination-btn"
              onClick={() => handleSave("draft")}
              disabled={saving}
            >
              {saving ? "저장 중..." : "임시저장"}
            </button>
            <button
              type="button"
              className="blog-search-btn"
              onClick={() => handleSave(editingPost.status === "published" ? "published" : "published")}
              disabled={saving}
            >
              {editingPost.status === "published" ? "발행 상태로 저장" : "공개 발행하기 →"}
            </button>
            {editingPost.id && editingPost.status === "published" && (
              <button
                type="button"
                className="blog-pagination-btn"
                onClick={() => handleSave("draft")}
                disabled={saving}
              >
                발행 취소
              </button>
            )}
            {editingPost.id && (
              editingPost.isTrashed ? (
                <button
                  type="button"
                  className="blog-pagination-btn"
                  onClick={() => handleTrashToggle(editingPost, "restore")}
                >
                  휴지통에서 복구
                </button>
              ) : (
                <button
                  type="button"
                  className="blog-pagination-btn"
                  style={{ color: "#991b1b" }}
                  onClick={() => handleTrashToggle(editingPost, "trash")}
                >
                  휴지통으로
                </button>
              )
            )}
          </div>
        </div>

        {editorError && (
          <div
            style={{
              padding: "14px 18px",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              borderRadius: "12px",
              marginBottom: "20px",
              fontSize: "0.88rem",
            }}
          >
            {editorError}
          </div>
        )}

        {editorNotice && (
          <div
            style={{
              padding: "14px 18px",
              background: "#dcfce7",
              border: "1px solid #bbf7d0",
              color: "#166534",
              borderRadius: "12px",
              marginBottom: "20px",
              fontSize: "0.88rem",
            }}
          >
            {editorNotice}
          </div>
        )}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--line, rgba(36, 38, 33, 0.12))",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, marginBottom: "6px" }}>
                글 제목 *
              </label>
              <input
                type="text"
                value={editingPost.title || ""}
                onChange={(e) => {
                  setEditingPost((p) => (p ? { ...p, title: e.target.value } : null));
                  setIsDirty(true);
                }}
                placeholder="제목을 입력하세요"
                className="blog-search-input"
                style={{ width: "100%" }}
                required
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.86rem", fontWeight: 600 }}>
                  URL 슬러그 (영문/숫자/하이픈) *
                </label>
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "0.76rem",
                    color: "var(--accent, #a74628)",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  제목으로 자동 생성
                </button>
              </div>
              <input
                type="text"
                value={editingPost.slug || ""}
                onChange={(e) => {
                  setEditingPost((p) => (p ? { ...p, slug: e.target.value } : null));
                  setIsDirty(true);
                }}
                placeholder="예: webdav-macos-folders"
                className="blog-search-input"
                style={{ width: "100%", fontFamily: "var(--font-geist-mono), monospace" }}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, marginBottom: "6px" }}>
                분류 (카테고리)
              </label>
              <input
                type="text"
                value={editingPost.category || ""}
                onChange={(e) => {
                  setEditingPost((p) => (p ? { ...p, category: e.target.value } : null));
                  setIsDirty(true);
                }}
                placeholder="예: 기술 가이드, 일상, 개발 노트"
                className="blog-search-input"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, marginBottom: "6px" }}>
                대표 이미지 URL (선택)
              </label>
              <input
                type="text"
                value={editingPost.coverImageUrl || ""}
                onChange={(e) => {
                  setEditingPost((p) => (p ? { ...p, coverImageUrl: e.target.value } : null));
                  setIsDirty(true);
                }}
                placeholder="/guides/... 또는 /api/blog/media/..."
                className="blog-search-input"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 600, marginBottom: "6px" }}>
              요약문 (목록 및 검색 결과 노출)
            </label>
            <textarea
              value={editingPost.summary || ""}
              onChange={(e) => {
                setEditingPost((p) => (p ? { ...p, summary: e.target.value } : null));
                setIsDirty(true);
              }}
              placeholder="글의 주요 내용과 문제 해결 요점을 간략히 요약해 주세요."
              rows={3}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid var(--line, rgba(36, 38, 33, 0.12))",
                background: "var(--paper, #f5f2eb)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Editor / Preview Tabs */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line, rgba(36, 38, 33, 0.12))", paddingBottom: "12px", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className={`blog-category-pill ${editorTab === "edit" ? "blog-category-pill-active" : ""}`}
                onClick={() => setEditorTab("edit")}
              >
                마크다운 작성
              </button>
              <button
                type="button"
                className={`blog-category-pill ${editorTab === "preview" ? "blog-category-pill-active" : ""}`}
                onClick={() => setEditorTab("preview")}
              >
                실시간 미리보기
              </button>
            </div>

            {/* Markdown Toolbar */}
            {editorTab === "edit" && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="button"
                  className="blog-pagination-btn"
                  style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  onClick={() => insertTextAtCursor("## ", "")}
                  title="제목 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  className="blog-pagination-btn"
                  style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  onClick={() => insertTextAtCursor("### ", "")}
                  title="제목 3"
                >
                  H3
                </button>
                <button
                  type="button"
                  className="blog-pagination-btn"
                  style={{ padding: "4px 8px", fontSize: "0.8rem", fontWeight: "bold" }}
                  onClick={() => insertTextAtCursor("**", "**")}
                  title="굵게"
                >
                  B
                </button>
                <button
                  type="button"
                  className="blog-pagination-btn"
                  style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  onClick={() => insertTextAtCursor("- ", "")}
                  title="목록"
                >
                  • 목록
                </button>
                <button
                  type="button"
                  className="blog-pagination-btn"
                  style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  onClick={() => insertTextAtCursor("1. ", "")}
                  title="번호 목록"
                >
                  1. 번호
                </button>
                <button
                  type="button"
                  className="blog-pagination-btn"
                  style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  onClick={() => insertTextAtCursor("[링크 텍스트](", ")")}
                  title="링크"
                >
                  🔗 링크
                </button>
                <button
                  type="button"
                  className="blog-pagination-btn"
                  style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  onClick={() => insertTextAtCursor("\n```\n", "\n```\n")}
                  title="코드 블록"
                >
                  💻 코드
                </button>
                <button
                  type="button"
                  className="blog-pagination-btn"
                  style={{ padding: "4px 10px", fontSize: "0.8rem", background: "var(--accent-tint, #fbf0eb)", color: "var(--accent, #a74628)" }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "업로드 중..." : "🖼️ 이미지 업로드"}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </div>

          {/* Content Area */}
          {editorTab === "edit" ? (
            <textarea
              ref={bodyTextareaRef}
              value={editingPost.body || ""}
              onChange={(e) => {
                setEditingPost((p) => (p ? { ...p, body: e.target.value } : null));
                setIsDirty(true);
              }}
              placeholder="마크다운 문법으로 글 본문을 작성해 주세요..."
              rows={22}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid var(--line, rgba(36, 38, 33, 0.12))",
                background: "var(--paper, #f5f2eb)",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.92rem",
                lineHeight: 1.7,
              }}
            />
          ) : (
            <div
              style={{
                padding: "24px",
                border: "1px solid var(--line, rgba(36, 38, 33, 0.12))",
                borderRadius: "14px",
                minHeight: "450px",
                background: "#faf8f5",
              }}
            >
              <BlogMarkdown content={editingPost.body || "*작성된 내용이 없습니다.*"} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Authenticated: Posts List View
  return (
    <div className="shell blog-shell" style={{ paddingBlock: "40px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <nav className="blog-breadcrumb">
            <Link href="/admin">관리자 대시보드</Link>
            <span className="blog-breadcrumb-sep">/</span>
            <span>블로그 글 관리</span>
          </nav>
          <p className="blog-eyebrow">ADMINISTRATOR AUTHORING</p>
          <h1 className="blog-title">블로그 글 관리</h1>
          <p className="blog-subtitle" style={{ margin: 0 }}>
            새 글 작성, 임시저장, 공개 발행 및 안전한 보관(휴지통)을 관리합니다.
          </p>
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={handleNewPost}
        >
          ✍️ 새 글 작성하기
        </button>
      </header>

      {/* Filter and Search Bar */}
      <div className="blog-controls-card">
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
          <div className="blog-category-list">
            <button
              type="button"
              className={`blog-category-pill ${filter === "all" ? "blog-category-pill-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              전체 보기
            </button>
            <button
              type="button"
              className={`blog-category-pill ${filter === "published" ? "blog-category-pill-active" : ""}`}
              onClick={() => setFilter("published")}
            >
              발행됨
            </button>
            <button
              type="button"
              className={`blog-category-pill ${filter === "draft" ? "blog-category-pill-active" : ""}`}
              onClick={() => setFilter("draft")}
            >
              임시저장
            </button>
            <button
              type="button"
              className={`blog-category-pill ${filter === "trash" ? "blog-category-pill-active" : ""}`}
              onClick={() => setFilter("trash")}
            >
              휴지통
            </button>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="search"
              placeholder="제목, 슬러그 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="blog-search-input"
              style={{ minHeight: "38px" }}
            />
          </div>
        </div>
      </div>

      {/* Posts Table */}
      {loadingPosts ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p>글 목록을 불러오고 있습니다...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="blog-empty-state">
          <div className="blog-empty-icon">📝</div>
          <h2 className="blog-empty-title">표시할 글이 없습니다</h2>
          <p className="blog-empty-desc">
            {filter === "trash"
              ? "휴지통이 비어 있습니다."
              : "새 글을 작성하여 유용한 지식을 공유해 보세요."}
          </p>
          {filter !== "trash" && (
            <button
              type="button"
              className="button button-primary"
              onClick={handleNewPost}
            >
              새 글 작성하기
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--line, rgba(36, 38, 33, 0.12))",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(36, 38, 33, 0.03)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="blog-table">
              <thead>
                <tr>
                  <th>상태</th>
                  <th>제목 및 슬러그</th>
                  <th>분류</th>
                  <th>발행일 / 수정일</th>
                  <th style={{ textAlign: "right" }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const isTrashed = Boolean(post.isTrashed);
                  const isPublished = post.status === "published";
                  return (
                    <tr key={post.id}>
                      <td>
                        {isTrashed ? (
                          <span className="blog-badge" style={{ background: "#fee2e2", color: "#991b1b" }}>
                            휴지통
                          </span>
                        ) : isPublished ? (
                          <span className="blog-badge" style={{ background: "#dcfce7", color: "#166534" }}>
                            발행됨
                          </span>
                        ) : (
                          <span className="blog-badge" style={{ background: "#fef3c7", color: "#92400e" }}>
                            임시저장
                          </span>
                        )}
                      </td>
                      <td>
                        <strong style={{ display: "block", fontSize: "0.98rem", marginBottom: "2px" }}>
                          {post.title}
                        </strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted, #6e6d65)", fontFamily: "var(--font-geist-mono), monospace" }}>
                          /blog/{post.slug}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.86rem" }}>{post.category}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.82rem", color: "var(--muted, #6e6d65)" }}>
                          {post.publishedAt ? `발행: ${post.publishedAt.slice(0, 10)}` : "미발행"}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                          {!isTrashed && isPublished && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="blog-pagination-btn"
                              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                            >
                              보기 ↗
                            </Link>
                          )}
                          <button
                            type="button"
                            className="blog-pagination-btn"
                            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                            onClick={() => handleEditPost(post.id)}
                          >
                            수정
                          </button>
                          {isTrashed ? (
                            <button
                              type="button"
                              className="blog-pagination-btn"
                              style={{ padding: "4px 10px", fontSize: "0.8rem", color: "#166534" }}
                              onClick={() => handleTrashToggle(post, "restore")}
                            >
                              복구
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="blog-pagination-btn"
                              style={{ padding: "4px 10px", fontSize: "0.8rem", color: "#991b1b" }}
                              onClick={() => handleTrashToggle(post, "trash")}
                            >
                              휴지통
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
