import Image from "next/image";
import ReactMarkdown from 'react-markdown'
import { getArticle } from '../../../../db';
import { 
    ARTICLE_DEFAULT_IMAGE,
    ARTICLE_DEFAULT_IMAGE_ALT,
} from '../../../../env';

type MarkdownImage = {
    src?: string;
    alt?: string;
}

export default async function Article({ params: { articleSlug }}: { params: { articleSlug: string[] } }) {
    // Because of how this route used to work, articles can be at either
    // issue/[issueNumber]/[category]/[articleSlug] or 
    // issue/[issueNumber]/[articleSlug]/
    const slug = articleSlug[articleSlug.length - 1];
    const article = await getArticle(slug);
    // render markdown images with the next/image component
    const imageRender = (props: MarkdownImage) => (
        <div className="flex justify-center items-center">
            <div className="relative h-[50vh] w-[70vw] max-w-[2000px]">
                <Image
                    fill
                    src={props.src || ARTICLE_DEFAULT_IMAGE}
                    alt={props.alt || ARTICLE_DEFAULT_IMAGE_ALT}
                    className="object-cover"
                />
            </div>
        </div>
    );

    return (
        <div>
            <div className='relative flex flex-col min-h-screen max-w-[529px] mx-auto py-2 sm:py-8'>
                {/* Title */}
                <header className='flex flex-col m-w-4xl mx-auto'>
                    <h1 className='text-center font-medium uppercase text-2xl'>
                        {article.title}
                    </h1>
                </header>
                <ReactMarkdown components={{img: imageRender}} className="font-lora">
                    {article.markdown}
                </ReactMarkdown>
            </div>
        </div>
    );
}