import Link from "next/link";

import type { ContentPost } from "@/lib/types";

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
              <span>
                <em>发布单位：</em>
                <strong>{publisherLabel}</strong>
              </span>
            </div>
            {post.summary ? <p className="article-summary">{post.summary}</p> : null}
          </header>

          {post.coverImageUrl ? (
            <figure className="article-cover">
              <img src={post.coverImageUrl} alt={post.title} />
            </figure>
          ) : null}

          <div className="article-copy article-body">
            {post.body.map((paragraph, index) => (
              <p key={`${post.id}-${index}`}>{paragraph}</p>
            ))}
          </div>

          <div className="article-actions">
            <Link href={categoryHref}>返回{categoryLabel}</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
