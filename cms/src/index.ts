import type { Core } from '@strapi/strapi';

import { demoSeed } from './seed/demo-content';

type ContentManagerEditMetadata = {
  label?: string;
  description?: string;
  placeholder?: string;
  visible?: boolean;
  editable?: boolean;
  mainField?: string;
};

type ContentManagerListMetadata = {
  label?: string;
  searchable?: boolean;
  sortable?: boolean;
};

type ContentManagerMetadata = {
  edit?: ContentManagerEditMetadata;
  list?: ContentManagerListMetadata;
};

type ContentManagerLayoutField = {
  name: string;
  size: number;
};

type ContentManagerConfiguration = {
  settings: Record<string, unknown>;
  metadatas: Record<string, ContentManagerMetadata>;
  layouts: {
    list: string[];
    edit: ContentManagerLayoutField[][];
  };
};

type ContentManagerContentTypeService = {
  findConfiguration: (
    contentType: unknown,
  ) => Promise<ContentManagerConfiguration & { uid: string }>;
  updateConfiguration: (
    contentType: unknown,
    configuration: ContentManagerConfiguration,
  ) => Promise<unknown>;
};

type ContentManagerComponentService = {
  findConfiguration: (
    component: unknown,
  ) => Promise<ContentManagerConfiguration & { uid: string; category: string }>;
  updateConfiguration: (
    component: unknown,
    configuration: ContentManagerConfiguration,
  ) => Promise<unknown>;
};

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

const hasContentSections = (value: unknown) =>
  Array.isArray(value) &&
  value.some(
    (item) => isRecord(item) && typeof item.__component === 'string',
  );

const extractParagraphs = (body: unknown) => {
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
        return extractParagraphs(parsed);
      }
    } catch {
      return body
        .split(/\r?\n\r?\n|\r?\n/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
  }

  return [];
};

const toContentSections = (body: unknown) => {
  if (isBlocksBody(body)) {
    return [
      {
        __component: 'shared.rich-text-block',
        content: body,
      },
    ];
  }

  const paragraphs = extractParagraphs(body);

  if (paragraphs.length === 0) {
    return [];
  }

  return [
    {
      __component: 'shared.rich-text-block',
      content: toBlocksBody(paragraphs),
    },
  ];
};

const withMetadata = (
  metadata: ContentManagerMetadata | undefined,
  {
    label,
    description = '',
    visible = true,
  }: {
    label: string;
    description?: string;
    visible?: boolean;
  },
): ContentManagerMetadata => ({
  ...metadata,
  edit: {
    ...(metadata?.edit ?? {}),
    label,
    description,
    placeholder: metadata?.edit?.placeholder ?? '',
    visible,
    editable: metadata?.edit?.editable ?? true,
  },
  list: {
    ...(metadata?.list ?? {}),
    label,
  },
});

const syncArticleEditorLayout = async (
  strapi: Core.Strapi,
  uid: string,
) => {
  const contentTypeService = strapi
    .plugin('content-manager')
    .service('content-types') as ContentManagerContentTypeService;
  const contentType = strapi.contentTypes[uid];

  if (!contentType) {
    return;
  }

  const current = await contentTypeService.findConfiguration(contentType);
  const attributes = contentType.attributes ?? {};
  const hasBody = Object.prototype.hasOwnProperty.call(attributes, 'body');
  const hasBodyImages = Object.prototype.hasOwnProperty.call(
    attributes,
    'bodyImages',
  );

  await contentTypeService.updateConfiguration(contentType, {
    settings: {
      ...current.settings,
      mainField: 'title',
      defaultSortBy: 'publishedDate',
      defaultSortOrder: 'DESC',
      pageSize: 10,
    },
    metadatas: {
      ...current.metadatas,
      title: withMetadata(current.metadatas.title, {
        label: '\u6807\u9898',
      }),
      slug: withMetadata(current.metadatas.slug, {
        label: 'Slug',
        description:
          '\u7528\u4e8e\u751f\u6210\u6587\u7ae0\u94fe\u63a5\uff0c\u5efa\u8bae\u4f7f\u7528\u82f1\u6587\u6216\u62fc\u97f3',
      }),
      publishedDate: withMetadata(current.metadatas.publishedDate, {
        label: '\u53d1\u5e03\u65f6\u95f4',
      }),
      author: withMetadata(current.metadatas.author, {
        label: '\u4f5c\u8005',
      }),
      body: withMetadata(current.metadatas.body, {
        label: '\u6b63\u6587\u5185\u5bb9',
        description:
          '\u76f4\u63a5\u5728\u6b63\u6587\u91cc\u8f93\u5165\u6587\u5b57\uff0c\u5e76\u5728\u5149\u6807\u4f4d\u7f6e\u63d2\u5165\u56fe\u7247\uff0c\u5c31\u4f1a\u6309\u987a\u5e8f\u663e\u793a\u5728\u5bf9\u5e94\u6bb5\u843d\u4e2d',
        visible: hasBody,
      }),
      contentSections: withMetadata(current.metadatas.contentSections, {
        label: '\u65b0\u7248\u5206\u6bb5\u5185\u5bb9',
        description: '',
        visible: false,
      }),
      coverImageUrl: withMetadata(current.metadatas.coverImageUrl, {
        label: '\u65e7\u7248\u5c01\u9762\u56fe\u94fe\u63a5',
        visible: false,
      }),
      coverImage: withMetadata(current.metadatas.coverImage, {
        label: '\u9876\u90e8\u5c01\u9762\u56fe',
        description:
          '\u663e\u793a\u5728\u6587\u7ae0\u9876\u90e8\uff0c\u4e0d\u4f1a\u63d2\u5165\u5230\u6b63\u6587\u4e2d\u95f4',
      }),
      attachments: withMetadata(current.metadatas.attachments, {
        label: '\u6587\u672b\u9644\u4ef6',
        description:
          '\u9644\u4ef6\u4f1a\u7edf\u4e00\u663e\u793a\u5728\u6587\u7ae0\u6700\u4e0b\u65b9\uff0c\u652f\u6301\u4e00\u6b21\u4e0a\u4f20\u591a\u4e2a\u6587\u4ef6',
      }),
      bodyImages: withMetadata(current.metadatas.bodyImages, {
        label: '\u65e7\u7248\u6b63\u6587\u56fe\u5e93',
        description: '',
        visible: false,
      }),
    },
    layouts: {
      ...current.layouts,
      list: ['title', 'publishedDate', 'author', 'slug'],
      edit: [
        [
          { name: 'title', size: 8 },
          { name: 'slug', size: 4 },
        ],
        [
          { name: 'publishedDate', size: 4 },
          { name: 'author', size: 4 },
        ],
        ...(hasBody ? [[{ name: 'body', size: 12 }]] : []),
        [
          { name: 'coverImage', size: 6 },
          { name: 'attachments', size: 6 },
        ],
      ],
    },
  });
};

const syncArticleComponentLayout = async (
  strapi: Core.Strapi,
  uid: string,
  fieldName: string,
  fieldLabel: string,
  fieldDescription: string,
) => {
  const componentService = strapi
    .plugin('content-manager')
    .service('components') as ContentManagerComponentService;
  const component = strapi.components[uid];

  if (!component) {
    return;
  }

  const current = await componentService.findConfiguration(component);

  await componentService.updateConfiguration(component, {
    settings: {
      ...current.settings,
      mainField: fieldName,
    },
    metadatas: {
      ...current.metadatas,
      [fieldName]: withMetadata(current.metadatas[fieldName], {
        label: fieldLabel,
        description: fieldDescription,
      }),
    },
    layouts: {
      ...current.layouts,
      edit: [[{ name: fieldName, size: 12 }]],
    },
  });
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
    const contentSections = post.contentSections;

    if (!post.author) {
      updates.author = defaultAuthor;
    }

    if (!isBlocksBody(body)) {
      const paragraphs = extractParagraphs(body);

      if (paragraphs.length > 0) {
        updates.body = toBlocksBody(paragraphs);
      }
    }

    if (!hasContentSections(contentSections)) {
      const normalizedBody = updates.body ?? body;
      const sections = toContentSections(normalizedBody);

      if (sections.length > 0) {
        updates.contentSections = sections;
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
    await syncArticleEditorLayout(strapi, 'api::news-post.news-post');
    await syncArticleEditorLayout(strapi, 'api::notice-post.notice-post');
    await syncArticleComponentLayout(
      strapi,
      'shared.rich-text-block',
      'content',
      '\u6b63\u6587\u6587\u5b57',
      '\u5728\u8fd9\u4e00\u5757\u5199\u5f53\u524d\u4f4d\u7f6e\u7684\u6b63\u6587\u5185\u5bb9',
    );
    await syncArticleComponentLayout(
      strapi,
      'shared.image-gallery-block',
      'images',
      '\u56fe\u7247',
      '\u53ef\u4e00\u6b21\u9009\u62e9\u591a\u5f20\u56fe\u7247\uff0c\u663e\u793a\u5728\u5f53\u524d\u63d2\u5165\u4f4d\u7f6e',
    );

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
