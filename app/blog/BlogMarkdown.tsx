import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function isSafeUrl(url: string | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return false;
  }
  return true;
}

function sanitizeUrl(url: string | undefined): string {
  if (!url || !isSafeUrl(url)) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("//")) {
    return "";
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }
  return "";
}

type BlogMarkdownProps = {
  content: string;
};

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className="blog-markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml={true}
        urlTransform={sanitizeUrl}
        components={{
          a({ node: _node, href, children, ...props }) {
            const safeHref = sanitizeUrl(href);
            const isExternal =
              safeHref.startsWith("http://") || safeHref.startsWith("https://");
            return (
              <a
                href={safeHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="blog-link"
                {...props}
              >
                {children}
              </a>
            );
          },
          img({ node: _node, src, alt, ...props }) {
            const safeSrc = sanitizeUrl(src);
            if (!safeSrc) return null;
            return (
              <figure className="blog-figure">
                <img
                  src={safeSrc}
                  alt={alt || ""}
                  loading="lazy"
                  className="blog-img"
                  {...props}
                />
                {alt ? <figcaption className="blog-figcaption">{alt}</figcaption> : null}
              </figure>
            );
          },
          table({ node: _node, children, ...props }) {
            return (
              <div className="blog-table-responsive">
                <table className="blog-table" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          pre({ node: _node, children, ...props }) {
            return (
              <pre className="blog-pre" {...props}>
                {children}
              </pre>
            );
          },
          code({ node: _node, className, children, ...props }) {
            const isInline = !className;
            return isInline ? (
              <code className="blog-inline-code" {...props}>
                {children}
              </code>
            ) : (
              <code className={`blog-code ${className || ""}`} {...props}>
                {children}
              </code>
            );
          },
          blockquote({ node: _node, children, ...props }) {
            return (
              <blockquote className="blog-blockquote" {...props}>
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
