import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown'

import { getArticle } from '../../../../db';
import { 
    ARTICLE_DEFAULT_IMAGE,
    ARTICLE_DEFAULT_IMAGE_ALT,
    DEFAULT_BROKEN_LINK,
    ARTICLE_DATE_FORMAT,
} from '../../../../env';
import { getAuthorsText } from "../../../../components/articles";
import { Divider } from "../../../../components/layout";

type MarkdownImage = {
    src?: string;
    alt?: string;
}

type Link = {
    href?: string;
    title?: string;
    children: any;
}

export default async function Article({ params: { articleSlug }}: { params: { articleSlug: string[] } }) {
    // Because of how this route used to work, articles can be at either
    // issue/[issueNumber]/[category]/[articleSlug] or 
    // issue/[issueNumber]/[articleSlug]/
    const slug = articleSlug[articleSlug.length - 1];
    const article = await getArticle(slug);

    // render markdown images with the next/image component
    const imageRender = (props: MarkdownImage) => (
        <>
            <div className="flex justify-center items-center my-4">
                <div className="relative xl:h-[800px] lg:h-[600px] md:h-[400px] sm:h-[350px] h-[350px] min-w-[100vw] w-full">
                    <Image
                        fill
                        src={props.src || ARTICLE_DEFAULT_IMAGE}
                        alt={props.alt || ARTICLE_DEFAULT_IMAGE_ALT}
                        className="object-contain"
                    />
                </div>
            </div>
        </>
    );

    // render links
    const linkRender = (props: Link) => (
        <>
            <Link href={props.href || DEFAULT_BROKEN_LINK} className="text-blue-500 underline visited:text-purple-600" >{props.children}</Link>
        </>
    );

    return (
        <>
            {/* Head */}
            <header className='flex flex-col mx-auto w-4/5 gap-3'>
                {/* Title */}
                <h1 className='text-left font-bold uppercase text-4xl'>
                    {article.title}
                </h1>
                {/* Teaser */}
                <p className="font-normal text-gray-600">
                    {article.teaser}
                </p>
                {/* Metadata */}
                <div className="flex flex-row gap-3 algin-center items-center">
                    {getAuthorsText(article, "text-base text-gray-600 font-medium -my-1 leading-4")}
                    <div className="border-l-[2px] border-gray-400 h-4"/>
                    <p className="text-sm text-gray-600 font-normal">{format(parseISO(article.publishedAt), ARTICLE_DATE_FORMAT)}</p>
                </div>
                {/* Divider */}
                <div className="border-b border-gray-300 w-full pt-2"/>
            </header>
            {/* Article */}
            <div className='flex flex-col min-h-screen max-w-[600px] mx-auto'>
                <ReactMarkdown 
                    className="font-lora text-lg leading-relaxed"
                    components={{
                    img: imageRender,
                    a: linkRender,
                    // remove the wrapping <p> tag - https://github.com/remarkjs/react-markdown/issues/731
                    p: ({ children }) => <div className="mb-6">{children}</div>
                }}>
                    {article.markdown}
                </ReactMarkdown>
            </div>
            {/* Gazelle Image */}
            <div className="flex flex-row items-center justify-center mb-4">
                <div className="relative h-12 w-full">
                    <Image
                        src="/logo.png"
                        alt="gazelle logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
            {/* Related and trending */}
            <div className="flex flex-row w-full">
                {/* Related */}
                <div className="w-3/5">
                    <Divider text="related" />
                </div>
                {/* Trending */}
                <div className="w-2/5">
                    <Divider text="trending" />
                </div>

            </div>
        </>
    );
}