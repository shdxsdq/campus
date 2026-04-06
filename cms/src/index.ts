import type { Core } from '@strapi/strapi';

import { demoSeed } from './seed/demo-content';

const seedCollection = async (
  strapi: Core.Strapi,
  uid: string,
  items: Record<string, unknown>[],
) => {
  const count = await strapi.db.query(uid).count();
  if (count > 0) {
    return;
  }

  for (const item of items) {
    await strapi.db.query(uid).create({ data: item });
  }
};

const toBlocksBody = (paragraphs: string[]) =>
  paragraphs
    .filter((paragraph) => paragraph.trim().length > 0)
    .map((paragraph) => ({
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: paragraph,
        },
      ],
    }));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isBlocksBody = (value: unknown) =>
  Array.isArray(value) &&
  value.some((item) => isRecord(item) && typeof item.type === 'string');

const extractParagraphs = (body: unknown, summary: string) => {
  if (isBlocksBody(body)) {
    return [];
  }

  if (Array.isArray(body)) {
    return body
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body) as unknown;
      if (Array.isArray(parsed)) {
        return extractParagraphs(parsed, summary);
      }
    } catch {
      return body
        .split(/\r?\n\r?\n|\r?\n/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
  }

  return summary.trim().length > 0 ? [summary.trim()] : [];
};

const migrateLegacyPosts = async (
  strapi: Core.Strapi,
  uid: string,
  defaultAuthor: string,
) => {
  const posts = (await strapi.db.query(uid).findMany()) as Array<
    Record<string, unknown>
  >;

  for (const post of posts) {
    const updates: Record<string, unknown> = {};
    const body = post.body;
    const summary = String(post.summary ?? '');

    if (!post.author) {
      updates.author = defaultAuthor;
    }

    if (!isBlocksBody(body)) {
      const paragraphs = extractParagraphs(body, summary);

      if (paragraphs.length > 0) {
        updates.body = toBlocksBody(paragraphs);
      }
    }

    if (Object.keys(updates).length > 0) {
      await strapi.db.query(uid).update({
        where: { id: post.id },
        data: updates,
      });
    }
  }
};

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (process.env.SEED_DEMO_DATA === 'false') {
      return;
    }

    const existingSite = await strapi.db
      .query('api::site-setting.site-setting')
      .findOne({ where: { id: 1 } });

    if (!existingSite) {
      await strapi.db
        .query('api::site-setting.site-setting')
        .create({ data: demoSeed.site });
    }

    await seedCollection(strapi, 'api::news-post.news-post', demoSeed.newsPosts);
    await seedCollection(
      strapi,
      'api::notice-post.notice-post',
      demoSeed.noticePosts,
    );
    await migrateLegacyPosts(strapi, 'api::news-post.news-post', '校园新闻组');
    await migrateLegacyPosts(strapi, 'api::notice-post.notice-post', '学校办公室');
    await seedCollection(
      strapi,
      'api::teacher-subject.teacher-subject',
      demoSeed.teacherSubjects,
    );
    await seedCollection(
      strapi,
      'api::teacher-profile.teacher-profile',
      demoSeed.teacherProfiles,
    );
    await seedCollection(
      strapi,
      'api::campus-spot.campus-spot',
      demoSeed.campusSpots,
    );
    await seedCollection(
      strapi,
      'api::gallery-album.gallery-album',
      demoSeed.galleryAlbums,
    );
  },
};
