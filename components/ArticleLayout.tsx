import { Suspense, ReactNode, createElement } from "react";
import Image from "next/image";
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from "rehype-raw";
import { Parser } from "commonmark";

import { getRelatedArticles, getGlobalTrendingArticles } from '../db';
import { 
    ARTICLE_DEFAULT_IMAGE,
    ARTICLE_DEFAULT_IMAGE_ALT,
    DEFAULT_BROKEN_LINK,
    ARTICLE_DATE_FORMAT,
    SHOW_ARTICLE_CAPTION_SINCE,
} from '../env';
import { ArticlePage, getAuthorsText } from "./articles";
import { Divider } from "./layout";
import StackedArticle from "./articles/Stacked";
import ListArticle from "./articles/List";
import StyledLink from "./StyledLink";
import ResizingImage from "./ResizingImage";
import Link from "next/link";

type MarkdownImage = {
    src?: string;
    alt?: string;
}

type Link = {
    href?: string;
    title?: string;
    children: any;
}

let renderedFirstLetter = true; // set to false to enable first letter styling

// render markdown images with the next/image component
const imageRender = ((props: MarkdownImage) => {
    return (
        <>
            <ResizingImage
                priority={false}
                src={props.src || ARTICLE_DEFAULT_IMAGE}
                alt={props.alt || ARTICLE_DEFAULT_IMAGE_ALT}
                className="relative w-full flex items-center justify-center"
                sizes="600px"
            />
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
        // place margin on divs so spacees (newlines) are rendered
        <div className={`mb-4 md:mb-6 ${firstLetter ? " first-letter:text-5xl first-letter:font-medium" : ""}`}>{children}</div>
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
    const articleContainer = "w-full md:max-w-[700px] lg:max-w-[700px]"

    const reader = new Parser();
    const parsed = reader.parse(article.markdown);
    const walker = parsed.walker()

    let featuredImage: { src?: string, alt?: string } = { src: article.image };
    let illustrator: string | null = null;

    // Only check the first 10 nodes from the md
    for (let index = 0; index < 10; index++) {
        let event = walker.next()
        if (!event) break;
        let node = event.node;

        // Take the first image
        if (node.type == 'image') {
            featuredImage.src = node.destination || ARTICLE_DEFAULT_IMAGE;
            featuredImage.alt = node.firstChild?.literal || ARTICLE_DEFAULT_IMAGE_ALT;
            
            // skip entering
            walker.next();
        }

        // Take the first illustrator
        if (node.type == 'text' && node.literal) {
            illustrator = node.literal;
        }

        // Break if we have both
        if (featuredImage.src && illustrator) break;
    }

    // skip rendering the first image (we will get it by article.image)
    let renderedFeaturedArticle = false;
    let renderedIllustrator = false;

    let featuredImageCaption = '';
    if (article.publishedAt > SHOW_ARTICLE_CAPTION_SINCE && featuredImage.alt)
        featuredImageCaption = featuredImage.alt;

    return (
        <>
            <div className="pt-4 pb-2 md:pb-6">
                {
                    article.image && (
                        <ResizingImage 
                            className="relative w-full flex items-center justify-center"
                            src={featuredImage.src || ARTICLE_DEFAULT_IMAGE}
                            alt={featuredImage.alt || ARTICLE_DEFAULT_IMAGE_ALT}
                            sizes="(max-width: 1024px) 90vw, 1024px"
                            priority={true}                
                        />                    
                    )
                }
                <div className="font-lora text-base py-1">{featuredImageCaption} <p className="text-sm inline">{illustrator}</p></div>
            </div>
            {/* Head */}
            <header className='flex flex-col mx-auto w-full max-w-[700px] gap-4 md:gap-3'>
                {/* Title */}
                <h1 className='text-left font-lora font-bold capitalize text-3xl md:text-4xl'>
                    {article.title}
                </h1>
                {/* Teaser */}
                <p className="font-light font-lora text-lg md:text-base text-gray-600 leading-normal">
                    {article.teaser}
                </p>
                {/* Metadata */}
                <div className="flex flex-row gap-3 align-center items-center">
                    {getAuthorsText(article, "text-base text-gray-600 font-medium -my-1 leading-4")}
                    <div className="border-l-[2px] border-gray-400 h-4"/>
                    <p className="text-base md:text-sm text-gray-600 font-normal">{format(parseISO(article.publishedAt), ARTICLE_DATE_FORMAT)}</p>
                </div>
                {/* Audio */}
                {
                    article.audioUri && (
                        <audio controls>
                            <source src={article.audioUri} type="audio/mp3" />
                             Your browser does not support the audio tag.
                        </audio>
                    )
                }
                {/* Divider */}
                <div className="border-b border-gray-500 w-full md:pt-2"/>
            </header>
            {/* Article */}
            <div className={`flex flex-col min-h-screen w-full mx-auto ${articleContainer}`}>
                <ReactMarkdown
                    className="font-lora text-lg leading-normal md:leading-relaxed"
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        img: (props: MarkdownImage) => {
                            if (!renderedFeaturedArticle) {
                                renderedFeaturedArticle = true;
                                return (<></>);
                            }

                            return imageRender(props);
                        },
                        a: linkRender,
                        // remove the wrapping <p> tag - https://github.com/remarkjs/react-markdown/issues/731
                        p: textRender,
                        em:  ({ children }: { children: ReactNode | ReactNode[] }) => {
                            if (!renderedIllustrator) {
                                renderedIllustrator = true;
                                return (<></>);
                            }

                            return <em>{children}</em>;
                        },
                        iframe: ({node, ...props}) => {
                            const iframeAttributes = node.properties;

                            // Override width
                            if (iframeAttributes) {
                                delete iframeAttributes.width;
                                iframeAttributes.className = (iframeAttributes.className || "") + " w-full";
                            }

                            return (
                                <iframe
                                    {...iframeAttributes}
                                />
                            );
                        }
                    }}
                >
                    {article.markdown}
                </ReactMarkdown>
            </div>
            {/* Gazelle Image */}
            <div className="flex flex-row items-center justify-center mb-4">
                <Link href="/" className="relative h-12 w-full">
                    <Image
                        src="/gazelle.svg"
                        alt="gazelle logo"
                        fill
                        unoptimized
                        className="object-contain"
                    />
                </Link>
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