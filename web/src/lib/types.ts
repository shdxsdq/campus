export type NavigationKey =
  | "home"
  | "campus"
  | "news"
  | "notice"
  | "teachers"
  | "gallery";

export type HeroSlide = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

export type FeaturedSection = {
  id: string;
  title: string;
  description: string;
  href: string;
  metaLabel: string;
  ctaLabel: string;
};

export type SiteSettings = {
  schoolName: string;
  schoolNameEn: string;
  welcomeText: string;
  address: string;
  phone: string;
  logoUrl: string;
  principalTitle: string;
  principalImageUrl: string;
  principalParagraphs: string[];
  heroSlides: HeroSlide[];
  featuredSections: FeaturedSection[];
  campusStats: string[];
  pageIntros: {
    campus: string;
    news: string;
    notice: string;
    teachers: string;
    gallery: string;
  };
  teacherArchiveNote: string;
};

export type RichContentNode = {
  type?: string;
  children?: RichContentNode[];
  text?: string;
  url?: string;
  level?: number;
  format?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  [key: string]: unknown;
};

export type MediaAsset = {
  url: string;
  alt?: string;
  name?: string;
  mime?: string;
  size?: number;
  ext?: string;
};

export type ContentPost = {
  id: string;
  type: "news" | "notice";
  slug: string;
  title: string;
  publishedDate: string;
  author?: string;
  summary?: string;
  body: string[];
  bodyBlocks?: RichContentNode[];
  highlights?: string[];
  coverImageUrl?: string;
  coverImageAlt?: string;
  attachments?: MediaAsset[];
};

export type TeacherSubject = {
  id: string;
  slug: string;
  name: string;
  description: string;
  note: string;
  sortOrder: number;
};

export type FactPair = {
  label: string;
  value: string;
};

export type TeacherProfile = {
  id: string;
  slug: string;
  subjectSlug: string;
  subjectName: string;
  name: string;
  avatar: string;
  role: string;
  shortSummary: string;
  tags: string[];
  philosophy: string;
  highlights: string[];
  growth: string[];
  basicFacts: FactPair[];
  honors: string[];
  sortOrder: number;
};

export type CampusSpot = {
  id: string;
  key: string;
  type: string;
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  tags: string[];
  facts: FactPair[];
  camera: [number, number, number];
  target: [number, number, number];
  quickLabel: string;
  quickDescription: string;
  sortOrder: number;
};

export type GalleryPhoto = {
  imageUrl: string;
  alt: string;
  caption: string;
};

export type GalleryAlbum = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  externalUrl: string;
  selectedCount: number;
  totalCount: number;
  photos: GalleryPhoto[];
  sortOrder: number;
};

export type SiteContent = {
  site: SiteSettings;
  news: ContentPost[];
  notices: ContentPost[];
  teacherSubjects: TeacherSubject[];
  teachers: TeacherProfile[];
  campusSpots: CampusSpot[];
  galleryAlbums: GalleryAlbum[];
};
