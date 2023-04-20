export const config = {
    runtime: 'experimental-edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import ArticleLayout from '../../../../../components/ArticleLayout';

// Wrapper component - this is so we can have both /issue/[issueNumber]/[articleSlug] and /issue/[issueNumber]/[category][articleSlug] work
// https://github.com/vercel/next.js/issues/48162

export default function Page({ params: { articleSlug2 }}: { params: { articleSlug2: string }}) {
    return (
        //@ts-ignore
        <ArticleLayout articleSlug={articleSlug2} />
    );
}
