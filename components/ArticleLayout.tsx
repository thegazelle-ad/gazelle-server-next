import { Suspense, ReactNode, createElement } from "react";
import ReactDom from 'react-dom';
import Image from "next/image";
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from "rehype-raw";

import { getRelatedArticles, getGlobalTrendingArticles } from '../db';
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
import ResizingImage from "./ResizingImage";

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
let renderedIllustrator = false;
let renderedFirstLetter = true; // set to false to enable first letter styling

// TODO - experiment with this and client components!
let image_alt: string[] = [];
let image_illustrator: string | undefined = undefined;

// render markdown images with the next/image component
const imageRender = ((props: MarkdownImage) => {
    return (
        <>
            <div className="flex justify-center items-center my-4">
                <Image
                    fill
                    priority={false}
                    src={props.src || ARTICLE_DEFAULT_IMAGE}
                    alt={props.alt || ARTICLE_DEFAULT_IMAGE_ALT}
                    className="object-contain"
                    sizes="80vw"
                />
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
    const articleContainer = "w-full md:max-w-[740px] lg:max-w-[650px] px-8 md:px-0"

    // skip rendering the first image (we will get it by article.image)
    renderedFeaturedArticle = false;
    renderedIllustrator = false;

    return (
        <>
            <div className="pt-4 pb-6">
                {
                    article.image && (
                        <ResizingImage 
                            className="relative w-full flex items-center justify-center"
                            src={article.image || ARTICLE_DEFAULT_IMAGE}
                            alt={image_alt[0] || ARTICLE_DEFAULT_IMAGE_ALT}
                            sizes="(max-width: 1024px) 90vw, 1024px"
                            priority={true}                
                        />                    
                    )
                }
            </div>
            {/* Head */}
            <header className='flex flex-col mx-auto w-4/5 gap-3 pb-4'>
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
                <div className="border-b border-gray-500 w-full pt-2"/>
            </header>
            {/* Article */}
            <div className={`flex flex-col min-h-screen w-full mx-auto ${articleContainer}`}>
                <ReactMarkdown
                    className="font-lora text-xl md:text-lg leading-relaxed"
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        img: (props: MarkdownImage) => {
                            if (!renderedFeaturedArticle) {
                                renderedFeaturedArticle = true;
                                image_alt.push(props.alt || ARTICLE_DEFAULT_IMAGE_ALT)
                                return (<></>);
                            }

                            return imageRender(props);
                        },
                        a: linkRender,
                        // remove the wrapping <p> tag - https://github.com/remarkjs/react-markdown/issues/731
                        p: textRender,
                        // em:  ({ children }: { children: ReactNode | ReactNode[] }) => {
                        //     if (!renderedIllustrator) {
                        //         renderedIllustrator = true;
                        //         image_illustrator = (children as string);
                        //         return (<></>);
                        //     }

                        //     return <em>{children}</em>;
                        // }
                    }}
                >
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