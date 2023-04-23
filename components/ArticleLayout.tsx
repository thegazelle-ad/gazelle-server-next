import { Suspense, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from "rehype-raw";

import { getArticle, getRelatedArticles, getGlobalTrendingArticles } from '../db';
import { 
    ARTICLE_DEFAULT_IMAGE,
    ARTICLE_DEFAULT_IMAGE_ALT,
    DEFAULT_BROKEN_LINK,
    ARTICLE_DATE_FORMAT,
} from '../env';
import { ArticlePage, getAuthorsText } from "./articles";
import { Divider } from "./layout";
import StackedArticle from "./articles/Stacked";
import ListArticle from "./articles/List";
import StyledLink from "./StyledLink";

type MarkdownImage = {
    src?: string;
    alt?: string;
}

type Link = {
    href?: string;
    title?: string;
    children: any;
}

let renderedFeaturedArticle = false;
let renderedFirstLetter = true; // set to false to enable first letter styling

// TODO - refactor out to a common file
// render markdown images with the next/image component
const imageRender = ((props: MarkdownImage) => {
    // Only mark first image as priority
    let priority = false;
    if (!renderedFeaturedArticle) {
        priority = true;
        renderedFeaturedArticle = true;
    }

    return (
        <>
            <div className="flex justify-center items-center my-4">
                <div className="relative xl:h-[800px] lg:h-[600px] md:h-[400px] h-[350px] min-w-[90vw] w-[90vw]">
                    <Image
                        fill
                        priority={priority}
                        src={props.src || ARTICLE_DEFAULT_IMAGE}
                        alt={props.alt || ARTICLE_DEFAULT_IMAGE_ALT}
                        className="object-contain"
                        sizes="80vw"
                    />
                </div>
            </div>
        </>
    )
    });

// render links
const linkRender = (props: Link) => (
    <>
        <StyledLink href={props.href || DEFAULT_BROKEN_LINK} className="py-2" >{props.children}</StyledLink>
    </>
);

// text renderer
const textRender = (({ children }: { children: ReactNode | ReactNode[] }) => {
    // Only mark first letter as priority
    let firstLetter = false;
    if (!renderedFirstLetter && Array.isArray(children) && children.length > 0 && typeof children[0] === 'string') {
        firstLetter = true;
        renderedFirstLetter = true;
    }

    return (
        <div className={`mb-6${firstLetter ? " first-letter:text-5xl first-letter:font-medium" : ""}`}>{children}</div>
    );
});

const RelatedArticles = (async ({ articleCategoryId, articleSlug, articlePublishedAt }: { articleCategoryId: number, articleSlug: string, articlePublishedAt: string}) => {
    const relatedArticles = await getRelatedArticles(articleCategoryId, articleSlug, articlePublishedAt);

    return (
        <>
            {
                relatedArticles.map((article, index) => (
                    <div key={article.slug}>
                        {index > 0 && <div className="h-[1px] bg-gray-500"/> }
                        <ListArticle article={article} imageHeight={"h-[300px] md:h-[250px]"} ellipsisTeaser={true} className="my-6"/>
                    </div>  
                ))
            }
        </>
    )
});

const TrendingArticles = (async () => {
    const trendingArticles = await getGlobalTrendingArticles();

    return (
        <div className="flex flex-col gap-4">
            {
                trendingArticles.map((article) => (
                    <div key={article.slug} >
                        <StackedArticle article={article} titleStyleAppend="text-2xl md:text-xl" />
                    </div>
                ))
            }
        </div>
    )   
});


export default async function Article({ article, slug }: { article: ArticlePage, slug: string }) {
    const articleContainer = "md:max-w-[600px] px-8 md:px-0"
    return (
        <>
            {/* Head */}
            <header className='flex flex-col mx-auto w-4/5 gap-3'>
                {/* Title */}
                <h1 className='text-left font-lora font-bold capitalize text-4xl'>
                    {article.title}
                </h1>
                {/* Teaser */}
                <p className="font-light text-lg md:text-base text-gray-600">
                    {article.teaser}
                </p>
                {/* Metadata */}
                <div className="flex flex-row gap-3 algin-center items-center">
                    {getAuthorsText(article, "text-base text-gray-600 font-medium -my-1 leading-4")}
                    <div className="border-l-[2px] border-gray-400 h-4"/>
                    <p className="text-base md:text-sm text-gray-600 font-normal">{format(parseISO(article.publishedAt), ARTICLE_DATE_FORMAT)}</p>
                </div>
                {/* Divider */}
                <div className="border-b border-gray-300 w-full pt-2"/>
            </header>
            {/* Article */}
            <div className={`flex flex-col min-h-screen w-full mx-auto ${articleContainer}`}>
                <ReactMarkdown 
                    className="font-lora text-xl md:text-lg leading-relaxed"
                    rehypePlugins={[rehypeRaw]}
                    components={{
                    img: imageRender,
                    a: linkRender,
                    // remove the wrapping <p> tag - https://github.com/remarkjs/react-markdown/issues/731
                    p: textRender,
                }}>
                    {article.markdown}
                </ReactMarkdown>
            </div>
            {/* Gazelle Image */}
            <div className="flex flex-row items-center justify-center mb-4">
                <div className="relative h-12 w-full">
                    <Image
                        src="/gazelle.svg"
                        alt="gazelle logo"
                        fill
                        unoptimized
                        className="object-contain"
                    />
                </div>
            </div>
            {/* Related and trending */}
            <div className="flex justify-center items-center">
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${articleContainer} md:max-w-[740px] lg:max-w-[800px]`}>
                    {/* Related */}
                    <div className="md:col-span-2">
                        <Divider text="related" className="" />
                        <Suspense fallback={<p>Loading related articles...</p>}>
                            {/* @ts-expect-error Server Component - https://github.com/vercel/next.js/issues/42292 */}
                            <RelatedArticles articleCategoryId={article.categoryId} articleSlug={slug} articlePublishedAt={article.publishedAt} />
                        </Suspense>
                    </div>
                    {/* Trending */}
                    <div className="">
                        <Divider text="trending" className="pb-6"/>
                        <Suspense fallback={<p>Loading trending articles...</p>}>
                            {/* @ts-expect-error Server Component - https://github.com/vercel/next.js/issues/42292 */}
                            <TrendingArticles /> 
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    );
}