import { notFound } from "next/navigation";

import { ArticleDetail } from "@/components/article-detail";
import { SiteShell } from "@/components/site-shell";
import { getNewsPostBySlug, getNewsPosts, getSiteContent } from "@/lib/site-data";

export async function generateStaticParams() {
  const posts = await getNewsPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  return {
    title: post?.title ?? "校园新闻",
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { site } = await getSiteContent();
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <SiteShell activeNav="news" site={site}>
      <ArticleDetail
        post={post}
        categoryLabel="校园新闻"
        categoryHref="/news"
        publisherLabel={site.schoolName}
      />
    </SiteShell>
  );
}
