import { sanitizeArticleHtml } from "@/lib/html-sanitizer";

export function HtmlContent({ html }: { html: string }) {
  return (
    <div
      className="article-html"
      dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(html) }}
    />
  );
}
