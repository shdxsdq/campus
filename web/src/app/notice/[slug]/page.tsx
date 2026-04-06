import { notFound } from "next/navigation";

import { ArticleDetail } from "@/components/article-detail";
import { SiteShell } from "@/components/site-shell";
import { getNoticePostBySlug, getNoticePosts, getSiteContent } from "@/lib/site-data";

export async function generateStaticParams() {
  const posts = await getNoticePosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNoticePostBySlug(slug);

  return {
    title: post?.title ?? "校园公告",
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { site } = await getSiteContent();
  const post = await getNoticePostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <SiteShell activeNav="notice" site={site}>
      <ArticleDetail
        post={post}
        categoryLabel="校园公告"
        categoryHref="/notice"
        publisherLabel={site.schoolName}
      />
    </SiteShell>
  );
}
