import { cache } from "react";

import { DEMO_CONTENT } from "@/data/demo-content";
import type {
  CampusSpot,
  ContentPost,
  FactPair,
  GalleryAlbum,
  GalleryPhoto,
  HeroSlide,
  MediaAsset,
  PostContentSection,
  RichContentNode,
  SiteContent,
  SiteSettings,
  TeacherProfile,
  TeacherSubject,
} from "@/lib/types";

type StrapiItem = Record<string, unknown> & {
  id?: number | string;
  documentId?: string;
  attributes?: Record<string, unknown>;
};

type StrapiResponse<T> = {
  data: T;
};

const STRAPI_URL =
  process.env.STRAPI_URL?.trim() || process.env.NEXT_PUBLIC_STRAPI_URL?.trim();
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN?.trim();

const toAbsoluteAssetUrl = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/assets/")) {
    return value;
  }

  if (STRAPI_URL && value.startsWith("/")) {
    return `${STRAPI_URL}${value}`;
  }

  return value;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeItem = (item: unknown): Record<string, unknown> => {
  if (!item || typeof item !== "object") {
    return {};
  }

  const strapiItem = item as StrapiItem;

  if (strapiItem.attributes && typeof strapiItem.attributes === "object") {
    return {
      id: strapiItem.id,
      documentId: strapiItem.documentId,
      ...strapiItem.attributes,
    };
  }

  return strapiItem;
};

const extractTextFromRichNode = (node: unknown): string => {
  if (!isRecord(node)) {
    return "";
  }

  if (typeof node.text === "string") {
    return node.text;
  }

  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromRichNode).join("");
  }

  return "";
};

const isMediaLikeRecord = (value: Record<string, unknown>) =>
  typeof value.url === "string" &&
  (typeof value.mime === "string" ||
    typeof value.hash === "string" ||
    typeof value.alternativeText === "string" ||
    typeof value.width === "number" ||
    typeof value.height === "number" ||
    "formats" in value);

const normalizeRichContentValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeRichContentValue(item));
  }

  if (!isRecord(value)) {
    return value;
  }

  const normalized = Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      normalizeRichContentValue(nestedValue),
    ]),
  );

  if (isMediaLikeRecord(normalized) && typeof normalized.url === "string") {
    normalized.url = toAbsoluteAssetUrl(normalized.url) ?? normalized.url;
  }

  return normalized;
};

const toRichContent = (value: unknown): RichContentNode[] | undefined => {
  if (Array.isArray(value) && value.some(isRecord)) {
    return value
      .filter(isRecord)
      .map((node) => normalizeRichContentValue(node) as RichContentNode);
  }

  if (typeof value === "string") {
    try {
      return toRichContent(JSON.parse(value));
    } catch {
      return undefined;
    }
  }

  return undefined;
};

const toBodyContent = (value: unknown) => {
  const richContent = toRichContent(value);

  if (richContent) {
    const paragraphs = richContent
      .map((block) => extractTextFromRichNode(block).trim())
      .filter((paragraph) => paragraph.length > 0);

    return {
      paragraphs,
      richContent,
    };
  }

  if (Array.isArray(value)) {
    return {
      paragraphs: value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
      richContent: undefined,
    };
  }

  if (typeof value === "string") {
    const paragraphs = value
      .split(/\r?\n\r?\n|\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);

    return {
      paragraphs,
      richContent: undefined,
    };
  }

  return {
    paragraphs: [],
    richContent: undefined,
  };
};

const toMediaAsset = (value: unknown): MediaAsset | null => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    const url = toAbsoluteAssetUrl(value);
    return url ? { url } : null;
  }

  if (Array.isArray(value)) {
    return toMediaAsset(value[0]);
  }

  if (isRecord(value) && "data" in value) {
    return toMediaAsset(value.data);
  }

  const item = normalizeItem(value);

  if (typeof item.url === "string") {
    return {
      url: toAbsoluteAssetUrl(item.url) ?? item.url,
      alt:
        typeof item.alternativeText === "string"
          ? item.alternativeText
          : typeof item.name === "string"
          ? item.name
          : undefined,
      name: typeof item.name === "string" ? item.name : undefined,
      mime: typeof item.mime === "string" ? item.mime : undefined,
      size: typeof item.size === "number" ? item.size : undefined,
      ext: typeof item.ext === "string" ? item.ext : undefined,
    };
  }

  return null;
};

const toMediaAssets = (value: unknown): MediaAsset[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => toMediaAsset(item))
      .filter((item): item is MediaAsset => Boolean(item?.url));
  }

  if (isRecord(value) && "data" in value) {
    return toMediaAssets(value.data);
  }

  const asset = toMediaAsset(value);
  return asset?.url ? [asset] : [];
};

const toContentSections = (value: unknown): PostContentSection[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      const section = normalizeItem(item);
      const component = String(section.__component ?? "");
      const id = String(section.id ?? `section-${index}`);

      if (component === "shared.rich-text-block") {
        const content = toRichContent(section.content);
        return content && content.length > 0
          ? {
              id,
              type: "rich-text" as const,
              content,
            }
          : null;
      }

      if (component === "shared.image-gallery-block") {
        const images = toMediaAssets(section.images);
        return images.length > 0
          ? {
              id,
              type: "image-gallery" as const,
              images,
            }
          : null;
      }

      return null;
    })
    .filter((item): item is PostContentSection => Boolean(item));
};

const withFallbackArray = <T>(items: T[] | undefined, fallback: T[]) =>
  items && items.length > 0 ? items : fallback;

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }

  return [];
};

const toFactPairs = (value: unknown): FactPair[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (
          item &&
          typeof item === "object" &&
          "label" in item &&
          "value" in item
        ) {
          return {
            label: String((item as FactPair).label),
            value: String((item as FactPair).value),
          };
        }

        if (Array.isArray(item) && item.length >= 2) {
          return {
            label: String(item[0]),
            value: String(item[1]),
          };
        }

        return null;
      })
      .filter((item): item is FactPair => Boolean(item));
  }

  if (typeof value === "string") {
    try {
      return toFactPairs(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return [];
};

const toTuple = (
  value: unknown,
  fallback: [number, number, number],
): [number, number, number] => {
  if (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((item) => typeof item === "number")
  ) {
    return [value[0], value[1], value[2]];
  }

  if (typeof value === "string") {
    try {
      return toTuple(JSON.parse(value), fallback);
    } catch {
      return fallback;
    }
  }

  return fallback;
};

const toGalleryPhotos = (value: unknown): GalleryPhoto[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const photo = item as Record<string, unknown>;

        return {
          imageUrl: toAbsoluteAssetUrl(String(photo.imageUrl ?? "")) ?? "",
          alt: String(photo.alt ?? ""),
          caption: String(photo.caption ?? ""),
        };
      })
      .filter((item): item is GalleryPhoto => Boolean(item?.imageUrl));
  }

  if (typeof value === "string") {
    try {
      return toGalleryPhotos(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return [];
};

const fetchStrapi = cache(async <T>(path: string): Promise<T | null> => {
  if (!STRAPI_URL) {
    return null;
  }

  const response = await fetch(`${STRAPI_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
});

const mapSiteSettings = (value: unknown): SiteSettings | null => {
  const item = normalizeItem(value);
  if (!item.schoolName) {
    return null;
  }

  const fallback = DEMO_CONTENT.site;

  const heroSlides = (Array.isArray(item.heroSlides) ? item.heroSlides : [])
    .map((slide) => {
      if (!slide || typeof slide !== "object") {
        return null;
      }

      const normalized = slide as Record<string, unknown>;

      return {
        id: String(normalized.id ?? normalized.title ?? "slide"),
        kicker: String(normalized.kicker ?? ""),
        title: String(normalized.title ?? ""),
        description: String(normalized.description ?? ""),
        imageUrl:
          toAbsoluteAssetUrl(String(normalized.imageUrl ?? "")) ??
          fallback.heroSlides[0]?.imageUrl ??
          "",
        imageAlt: String(normalized.imageAlt ?? normalized.title ?? ""),
      } satisfies HeroSlide;
    })
    .filter((slide): slide is HeroSlide => Boolean(slide?.title));

  return {
    schoolName: String(item.schoolName ?? fallback.schoolName),
    schoolNameEn: String(item.schoolNameEn ?? fallback.schoolNameEn),
    welcomeText: String(item.welcomeText ?? fallback.welcomeText),
    address: String(item.address ?? fallback.address),
    phone: String(item.phone ?? fallback.phone),
    logoUrl:
      toAbsoluteAssetUrl(String(item.logoUrl ?? "")) ?? fallback.logoUrl,
    principalTitle: String(item.principalTitle ?? fallback.principalTitle),
    principalImageUrl:
      toAbsoluteAssetUrl(String(item.principalImageUrl ?? "")) ??
      fallback.principalImageUrl,
    principalParagraphs: withFallbackArray(
      toStringArray(item.principalParagraphs),
      fallback.principalParagraphs,
    ),
    heroSlides: withFallbackArray(heroSlides, fallback.heroSlides),
    featuredSections: fallback.featuredSections,
    campusStats: withFallbackArray(
      toStringArray(item.campusStats),
      fallback.campusStats,
    ),
    pageIntros: {
      campus: String(item.campusIntro ?? fallback.pageIntros.campus),
      news: String(item.newsIntro ?? fallback.pageIntros.news),
      notice: String(item.noticeIntro ?? fallback.pageIntros.notice),
      teachers: String(item.teachersIntro ?? fallback.pageIntros.teachers),
      gallery: String(item.galleryIntro ?? fallback.pageIntros.gallery),
    },
    teacherArchiveNote: String(
      item.teacherArchiveNote ?? fallback.teacherArchiveNote,
    ),
  };
};

const mapPost = (value: unknown, type: "news" | "notice"): ContentPost | null => {
  const item = normalizeItem(value);
  if (!item.slug || !item.title) {
    return null;
  }

  const bodyContent = toBodyContent(item.body);
  const mediaAsset = toMediaAsset(item.coverImage ?? item.coverImageUrl);
  const contentSections = toContentSections(item.contentSections);

  return {
    id: String(item.documentId ?? item.id ?? item.slug),
    type,
    slug: String(item.slug),
    title: String(item.title),
    publishedDate: String(item.publishedDate ?? item.publishedAt ?? ""),
    author: typeof item.author === "string" ? item.author : undefined,
    body: bodyContent.paragraphs,
    bodyBlocks: bodyContent.richContent,
    coverImageUrl: mediaAsset?.url,
    coverImageAlt: mediaAsset?.alt,
    contentSections,
    attachments: toMediaAssets(item.attachments),
  };
};

const mapTeacherSubject = (value: unknown): TeacherSubject | null => {
  const item = normalizeItem(value);
  if (!item.slug || !item.name) {
    return null;
  }

  return {
    id: String(item.documentId ?? item.id ?? item.slug),
    slug: String(item.slug),
    name: String(item.name),
    description: String(item.description ?? ""),
    note: String(item.note ?? ""),
    sortOrder: Number(item.sortOrder ?? 999),
  };
};

const mapTeacherProfile = (value: unknown): TeacherProfile | null => {
  const item = normalizeItem(value);
  if (!item.slug || !item.name || !item.subjectSlug) {
    return null;
  }

  return {
    id: String(item.documentId ?? item.id ?? item.slug),
    slug: String(item.slug),
    subjectSlug: String(item.subjectSlug),
    subjectName: String(item.subjectName ?? ""),
    name: String(item.name),
    avatar: String(item.avatar ?? item.name).slice(0, 1),
    role: String(item.role ?? ""),
    shortSummary: String(item.shortSummary ?? ""),
    tags: toStringArray(item.tags),
    philosophy: String(item.philosophy ?? ""),
    highlights: toStringArray(item.highlights),
    growth: toStringArray(item.growth),
    basicFacts: toFactPairs(item.basicFacts),
    honors: toStringArray(item.honors),
    sortOrder: Number(item.sortOrder ?? 999),
  };
};

const mapCampusSpot = (value: unknown): CampusSpot | null => {
  const item = normalizeItem(value);
  if (!item.key || !item.name) {
    return null;
  }

  const fallback =
    DEMO_CONTENT.campusSpots.find((spot) => spot.key === item.key) ??
    DEMO_CONTENT.campusSpots[0];

  return {
    id: String(item.documentId ?? item.id ?? item.key),
    key: String(item.key),
    type: String(item.type ?? fallback.type),
    name: String(item.name),
    subtitle: String(item.subtitle ?? fallback.subtitle),
    description: String(item.description ?? fallback.description),
    imageUrl:
      toAbsoluteAssetUrl(String(item.imageUrl ?? "")) ?? fallback.imageUrl,
    tags: withFallbackArray(toStringArray(item.tags), fallback.tags),
    facts: withFallbackArray(toFactPairs(item.facts), fallback.facts),
    camera: toTuple(item.camera, fallback.camera),
    target: toTuple(item.target, fallback.target),
    quickLabel: String(item.quickLabel ?? fallback.quickLabel),
    quickDescription: String(
      item.quickDescription ?? fallback.quickDescription,
    ),
    sortOrder: Number(item.sortOrder ?? fallback.sortOrder),
  };
};

const mapGalleryAlbum = (value: unknown): GalleryAlbum | null => {
  const item = normalizeItem(value);
  if (!item.slug || !item.title) {
    return null;
  }

  return {
    id: String(item.documentId ?? item.id ?? item.slug),
    slug: String(item.slug),
    title: String(item.title),
    summary: String(item.summary ?? ""),
    coverImageUrl:
      toAbsoluteAssetUrl(String(item.coverImageUrl ?? "")) ??
      DEMO_CONTENT.galleryAlbums[0].coverImageUrl,
    externalUrl: String(item.externalUrl ?? ""),
    selectedCount: Number(item.selectedCount ?? 0),
    totalCount: Number(item.totalCount ?? 0),
    photos: toGalleryPhotos(item.photos),
    sortOrder: Number(item.sortOrder ?? 999),
  };
};

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (!STRAPI_URL) {
    return DEMO_CONTENT;
  }

  const postPopulateQuery =
    "sort=publishedDate:desc" +
    "&populate[coverImage][fields][0]=url" +
    "&populate[coverImage][fields][1]=alternativeText" +
    "&populate[coverImage][fields][2]=name" +
    "&populate[attachments][fields][0]=url" +
    "&populate[attachments][fields][1]=name" +
    "&populate[attachments][fields][2]=alternativeText" +
    "&populate[attachments][fields][3]=mime" +
    "&populate[attachments][fields][4]=size" +
    "&populate[attachments][fields][5]=ext";

  const [
    siteResponse,
    newsResponse,
    noticeResponse,
    subjectResponse,
    teacherResponse,
    spotResponse,
    albumResponse,
  ] = await Promise.all([
    fetchStrapi<StrapiResponse<unknown>>("/api/site-setting"),
    fetchStrapi<StrapiResponse<unknown[]>>(
      `/api/news-posts?${postPopulateQuery}`,
    ),
    fetchStrapi<StrapiResponse<unknown[]>>(
      `/api/notice-posts?${postPopulateQuery}`,
    ),
    fetchStrapi<StrapiResponse<unknown[]>>(
      "/api/teacher-subjects?sort=sortOrder:asc",
    ),
    fetchStrapi<StrapiResponse<unknown[]>>(
      "/api/teacher-profiles?sort=sortOrder:asc",
    ),
    fetchStrapi<StrapiResponse<unknown[]>>(
      "/api/campus-spots?sort=sortOrder:asc",
    ),
    fetchStrapi<StrapiResponse<unknown[]>>(
      "/api/gallery-albums?sort=sortOrder:asc",
    ),
  ]);

  return {
    site: mapSiteSettings(siteResponse?.data) ?? DEMO_CONTENT.site,
    news: withFallbackArray(
      (Array.isArray(newsResponse?.data) ? newsResponse.data : [])
        .map((item) => mapPost(item, "news"))
        .filter((item): item is ContentPost => Boolean(item)),
      DEMO_CONTENT.news,
    ),
    notices: withFallbackArray(
      (Array.isArray(noticeResponse?.data) ? noticeResponse.data : [])
        .map((item) => mapPost(item, "notice"))
        .filter((item): item is ContentPost => Boolean(item)),
      DEMO_CONTENT.notices,
    ),
    teacherSubjects: withFallbackArray(
      (Array.isArray(subjectResponse?.data) ? subjectResponse.data : [])
        .map(mapTeacherSubject)
        .filter((item): item is TeacherSubject => Boolean(item))
        .sort((left, right) => left.sortOrder - right.sortOrder),
      DEMO_CONTENT.teacherSubjects,
    ),
    teachers: withFallbackArray(
      (Array.isArray(teacherResponse?.data) ? teacherResponse.data : [])
        .map(mapTeacherProfile)
        .filter((item): item is TeacherProfile => Boolean(item))
        .sort((left, right) => left.sortOrder - right.sortOrder),
      DEMO_CONTENT.teachers,
    ),
    campusSpots: withFallbackArray(
      (Array.isArray(spotResponse?.data) ? spotResponse.data : [])
        .map(mapCampusSpot)
        .filter((item): item is CampusSpot => Boolean(item))
        .sort((left, right) => left.sortOrder - right.sortOrder),
      DEMO_CONTENT.campusSpots,
    ),
    galleryAlbums: withFallbackArray(
      (Array.isArray(albumResponse?.data) ? albumResponse.data : [])
        .map(mapGalleryAlbum)
        .filter((item): item is GalleryAlbum => Boolean(item))
        .sort((left, right) => left.sortOrder - right.sortOrder),
      DEMO_CONTENT.galleryAlbums,
    ),
  };
});

export const getNewsPosts = cache(async () => (await getSiteContent()).news);
export const getNoticePosts = cache(async () => (await getSiteContent()).notices);
export const getTeacherSubjects = cache(
  async () => (await getSiteContent()).teacherSubjects,
);
export const getTeachers = cache(async () => (await getSiteContent()).teachers);
export const getCampusSpots = cache(
  async () => (await getSiteContent()).campusSpots,
);
export const getGalleryAlbums = cache(
  async () => (await getSiteContent()).galleryAlbums,
);

export const getNewsPostBySlug = cache(async (slug: string) => {
  const posts = await getNewsPosts();
  return posts.find((post) => post.slug === slug) ?? null;
});

export const getNoticePostBySlug = cache(async (slug: string) => {
  const posts = await getNoticePosts();
  return posts.find((post) => post.slug === slug) ?? null;
});

export const getTeacherSubjectBySlug = cache(async (slug: string) => {
  const subjects = await getTeacherSubjects();
  return subjects.find((subject) => subject.slug === slug) ?? null;
});

export const getTeachersBySubject = cache(async (slug: string) => {
  const teachers = await getTeachers();
  return teachers.filter((teacher) => teacher.subjectSlug === slug);
});

export const getTeacherProfileBySlug = cache(
  async (subjectSlug: string, teacherSlug: string) => {
    const teachers = await getTeachersBySubject(subjectSlug);
    return teachers.find((teacher) => teacher.slug === teacherSlug) ?? null;
  },
);

export const formatDisplayDate = (value: string) =>
  new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
