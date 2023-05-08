export const UNCATEGORIZED_CATEGORY_ID = Number(process.env.UNCATEGORIZED_CATEGORY_ID) || 1;
export const UNCATEGORIZED_CATEGORY_NAME = process.env.UNCATEGORIZED_CATEGORY_NAME || 'uncategorized';
export const UNCATEGORIZED_CATEGORY_SLUG = process.env.UNCATEGORIZED_CATEGORY_SLUG || 'uncategorized';

export const DEV = process.env.NODE_ENV !== 'production';

export const DEFAULT_STAFF_TITLE = 'Contributing Writer';
export const DEFAULT_STAFF_IMAGE = '/icons/no-profile.svg';
export const DEFAULT_STAFF_BIO = '';
export const DEFAULT_STAFF_ORDER = 0;

export const DATABASE_HOST = process.env.DATABASE_HOST!;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME!;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;

export const UPSTASH_URL = process.env.UPSTASH_URL!;
export const UPSTASH_TOKEN = process.env.UPSTASH_TOKEN!;

export const ARTICLE_TYPE_NORMAL = 0;
export const ARTICLE_TYPE_FEATURED = 1;
export const ARTICLE_TYPE_EDITORS_PICKS = 2;
export type ARTICLE_TYPES = typeof ARTICLE_TYPE_NORMAL | typeof ARTICLE_TYPE_FEATURED | typeof ARTICLE_TYPE_EDITORS_PICKS;

export const ARTICLE_DEFAULT_IMAGE = 'https://cdn.thegazelle.org/gazelle/2016/02/saadiyat-reflection.jpg';
export const ARTICLE_DEFAULT_IMAGE_ALT = 'image';
export const ARTICLE_DEFAULT_TEASER = '';
export const ARTICLE_DEFAULT_PUBLISHED_AT = '1970-01-01 00:00:00';
export const ARTICLE_DATE_FORMAT = 'MMM d, yyyy';

export const DEFAULT_ISSUE_DATE = '1970-01-01';
export const DEFAULT_BROKEN_LINK = 'https://thegazelle.org/404';
export const DEFAULT_SITE_TITLE = 'The Gazelle | NYU Abu Dhabi News';

export const DATABASE_DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DATABASE_DATE_FORMAT = 'yyyy-MM-dd';

export const TEASER_ELLIPSIS_LENGTH = 150;

export const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;

export const SUBMIT_A_TIP_URL = process.env.NEXT_PUBLIC_SUBMIT_A_TIP_URL || '';
export const MAILING_LIST = process.env.NEXT_PUBLIC_MAILING_LIST || '';

export const SHOW_ARTICLE_CAPTION_SINCE = '2023-04-18 00:00:00';
