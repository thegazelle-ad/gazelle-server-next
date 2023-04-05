export const UNCATEGORIZED_CATEGORY_ID = Number(process.env.UNCATEGORIZED_CATEGORY_ID) || 1;
export const UNCATEGORIZED_CATEGORY_NAME = process.env.UNCATEGORIZED_CATEGORY_NAME || 'uncategorized';
export const UNCATEGORIZED_CATEGORY_SLUG = process.env.UNCATEGORIZED_CATEGORY_SLUG || 'uncategorized';

export const DEV = process.env.NODE_ENV !== 'production';

export const DEFAULT_STAFF_TITLE = 'Contributing Writer';
export const DEFAULT_STAFF_IMAGE = 'https://cdn.thegazelle.org/gazelle/2022/Fall_Staff_Bios/githmi-rabel.jpg';
export const DEFAULT_STAFF_BIO = '';
export const DEFAULT_STAFF_ORDER = 0;

export const DEFAULT_ARTICLE_IMAGE = 'https://cdn.thegazelle.org/gazelle/2022/Fall_Staff_Bios/githmi-rabel.jpg';
export const DEFAULT_ARTICLE_TEASER = '';

export const DATABASE_HOST = process.env.DATABASE_HOST!;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME!;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;
