import Link from "next/link";

import { RichContent } from "@/components/rich-content";
import type { ContentPost, MediaAsset } from "@/lib/types";

const formatArticleTimestamp = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.valueOf())) {
    return value;
  }

  const hasTime = value.includes("T") || /\d{2}:\d{2}/.test(value);

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(hasTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      : {}),
  }).format(date);
};

const formatAttachmentSize = (size?: number) => {
  if (!size || size <= 0) {
    return undefined;
  }

  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  if (size >= 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${size.toFixed(0)} B`;
};

const formatAttachmentType = (attachment: MediaAsset) => {
  if (attachment.ext) {
    return attachment.ext.replace(".", "").toUpperCase();
  }

  if (attachment.mime) {
    const [, subtype = ""] = attachment.mime.split("/");
    return subtype.toUpperCase() || undefined;
  }

  return undefined;
};

const formatAttachmentMeta = (attachment: MediaAsset) =>
  [formatAttachmentType(attachment), formatAttachmentSize(attachment.size)]
    .filter((item): item is string => Boolean(item))
    .join(" · ");

export function ArticleDetail({
  post,
  categoryLabel,
  categoryHref,
  publisherLabel,
}: {
  post: ContentPost;
  categoryLabel: string;
  categoryHref: string;
  publisherLabel: string;
}) {
  const attachments = post.attachments ?? [];

  return (
    <main className="article-page section">
      <div className="container">
        <nav className="article-breadcrumb" aria-label="当前位置">
          <span>当前位置：</span>
          <Link href="/">首页</Link>
          <span>&gt;</span>
          <Link href={categoryHref}>{categoryLabel}</Link>
          <span>&gt;</span>
          <span>详情</span>
        </nav>

        <article className="article-shell">
          <header className="article-header">
            <h1>{post.title}</h1>
            <div className="article-meta">
              <span>
                <em>发布栏目：</em>
                <strong>{categoryLabel}</strong>
              </span>
              <span>
                <em>发布时间：</em>
                <strong>{formatArticleTimestamp(post.publishedDate)}</strong>
              </span>
              {post.author ? (
                <span>
                  <em>发布作者：</em>
                  <strong>{post.author}</strong>
                </span>
              ) : null}
              <span>
                <em>发布单位：</em>
                <strong>{publisherLabel}</strong>
              </span>
            </div>
          </header>

          {post.coverImageUrl ? (
            <figure className="article-cover">
              <img src={post.coverImageUrl} alt={post.coverImageAlt ?? post.title} />
            </figure>
          ) : null}

          <div className="article-copy article-body">
            {post.bodyBlocks && post.bodyBlocks.length > 0 ? (
              <RichContent content={post.bodyBlocks} />
            ) : (
              post.body.map((paragraph, index) => <p key={`${post.id}-${index}`}>{paragraph}</p>)
            )}
          </div>

          {attachments.length > 0 ? (
            <section className="article-attachments" aria-labelledby="article-attachments-title">
              <h2 id="article-attachments-title">附件下载</h2>
              <div className="article-attachment-list">
                {attachments.map((attachment, index) => {
                  const label = attachment.name ?? attachment.alt ?? `附件 ${index + 1}`;
                  const meta = formatAttachmentMeta(attachment);

                  return (
                    <a
                      key={`${attachment.url}-${index}`}
                      className="article-attachment-link"
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <strong>{label}</strong>
                      {meta ? <span>{meta}</span> : null}
                    </a>
                  );
                })}
              </div>
            </section>
          ) : null}

          <div className="article-actions">
            <Link href={categoryHref}>返回{categoryLabel}</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
