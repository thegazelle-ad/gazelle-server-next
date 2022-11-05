
export interface ArticleData {
    title: string;
    teaser: string;
    name: string;
    html: string;
    url: string;
    published_at: number;
    issueNumber: string;
    category: ArticleCategory;
    slug: string;
    authors: StaffInfo[]; // TODO - fix this
    is_interactive: boolean;
    image_url: string;
}
// interface ArticleData {
//     title: string;
//     teaser: string;
//     issueNumber: string;
//     category: ArticleCategory;
//     slug: string;
//     authors: object; // TODO - fix this
//     is_interactive: boolean;
//     image_url: string;
// }

export interface ArticleCategory {
    slug: string;
}

export interface Author {
    slug: string;
    name: string;
}

// TODO - rename staffINfo to staff
export interface StaffInfo {
    name: string;
    biography?: string;
    title?: string;
    photo?: string;
    // TODO - clean this up=
    // other
    slug: string;
    image_url: string;
    job_title: string;
    articles: ArticleData[];
}

export interface TeamInfo {
    name: string;
}

export interface TeamData {
    teamInfo: TeamInfo;
    members: StaffInfo[];
}

export interface Related {
    trending: ArticleData[];
    relatedArticles: ArticleData[];
}
