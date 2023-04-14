export const UNCATEGORIZED_CATEGORY_ID = Number(process.env.UNCATEGORIZED_CATEGORY_ID) || 1;
export const UNCATEGORIZED_CATEGORY_NAME = process.env.UNCATEGORIZED_CATEGORY_NAME || 'uncategorized';
export const UNCATEGORIZED_CATEGORY_SLUG = process.env.UNCATEGORIZED_CATEGORY_SLUG || 'uncategorized';

export const DEV = process.env.NODE_ENV !== 'production';

export const DEFAULT_STAFF_TITLE = 'Contributing Writer';
export const DEFAULT_STAFF_IMAGE = 'https://cdn.thegazelle.org/gazelle/2022/Fall_Staff_Bios/githmi-rabel.jpg';
export const DEFAULT_STAFF_BIO = '';
export const DEFAULT_STAFF_ORDER = 0;

export const DATABASE_HOST = process.env.DATABASE_HOST!;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME!;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;

export const ARTICLE_TYPE_NORMAL = 0;
export const ARTICLE_TYPE_FEATURED = 1;
export const ARTICLE_TYPE_EDITORS_PICKS = 2;
export type ARTICLE_TYPES = typeof ARTICLE_TYPE_NORMAL | typeof ARTICLE_TYPE_FEATURED | typeof ARTICLE_TYPE_EDITORS_PICKS;

export const ARTICLE_DEFAULT_IMAGE = 'https://cdn.thegazelle.org/gazelle/2022/Fall_Staff_Bios/githmi-rabel.jpg';
export const ARTICLE_DEFAULT_IMAGE_ALT = 'image';
export const ARTICLE_DEFAULT_TEASER = '';
export const ARTICLE_DEFAULT_PUBLISHED_AT = '1970-01-01 00:00:00';
export const ARTICLE_DATE_FORMAT = 'MMM d, yyyy';

export const DEFAULT_BROKEN_LINK = 'https://thegazelle.org/404';
export const DEFAULT_SITE_TITLE = 'The Gazelle | NYU Abu Dhabi News';

export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
