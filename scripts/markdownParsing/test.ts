import { Parser } from "commonmark";

const article = `![my super long alt text](https://url "title")\n\nIllustration by Ahmed Bilal`;

const reader = new Parser();
const parsed = reader.parse(article);
const walker = parsed.walker()

let featuredImage: { src?: string, alt?: string } = { src: article };
let illustrator: string | null = null;

// Only check the first 10 nodes from the md
for (let index = 0; index < 10; index++) {
    let event = walker.next()
    if (!event) break;
    let node = event.node;

    console.log('type', node.type, 'title: ', node.title);

    // Take the first image
    if (node.type == 'image') {
        featuredImage.src = node.destination || '';
        featuredImage.alt = node.title || '';
        
        console.log('fc', node.firstChild?.literal);
        // skip entering
        // node.firstChild();

        // console.log('event', event);
        // node = event!.node;
        // console.log('skipping', node.title, node.destination);
        // event = walker.next();
        // node = event!.node;
        // console.log('skipping', node.title, node.destination);
    }

    // Take the first illustrator
    if (node.type == 'text' && node.literal) {
        illustrator = node.literal;
    }

    // Break if we have both
    if (featuredImage.src && illustrator) break;
}

console.log(JSON.stringify(featuredImage));
