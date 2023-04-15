export default function ImageRouter ({ src, width, quality }: { src: string, width?: number, quality?: number }) {
    if (width === undefined)
        width = 1000;

    if (quality === undefined)
        quality = 75;

    if (!src) {
        return '';
    }

    const cdnImages = 'https://cdn.thegazelle.org';
    const optimizedImages = 'https://cdnbeta.thegazelle.org';
    if (src.startsWith(cdnImages)) {
        src = optimizedImages + src.slice(cdnImages.length, src.length);
        return `${src}?format=webp&quality=${quality}&width=${width}`;
    }

    return src;
}
