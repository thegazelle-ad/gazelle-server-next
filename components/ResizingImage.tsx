"use client"

import Image from "next/image";
import { useState } from "react"

export const ResizingImage = ({ src, alt, className, sizes, priority }: { src: string, alt: string, className?: string, sizes?: string, priority?: boolean }) => {

    const [paddingTop, setPaddingTop] = useState("calc(100% / (1000 / 500))");

    return (
        <div className={`relative ${className}`} style={{paddingTop}}>
            <Image
                fill
                src={src}
                alt={alt}
                sizes={sizes}
                priority={priority ? true : false}
                className="object-contain object-center"
                onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                    setPaddingTop(`calc(100% / (${naturalWidth} / ${naturalHeight})`)}
            />
        </div>
    );
};

export default ResizingImage;
