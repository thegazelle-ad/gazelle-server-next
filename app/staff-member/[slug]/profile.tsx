"use client"

import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

import { AuthorProfile } from "../../../components/articles";
import ProfileArticle from '../../../components/articles/List'

export const UserContent = ({ staffProfile }: { staffProfile: AuthorProfile }) => {
    const params = useSearchParams();
    const path = usePathname();

    const [contentType, setContentType] = useState<"articles" | "illustrations">(staffProfile.illustrations.length > 0 ? "illustrations" : "articles");

    // set content type based on query param
    useEffect(() => {
        if (params.get("contentType") === "articles" || params.get("contentType") === "illustrations") {
            setContentType(params.get("contentType") as "articles" | "illustrations");
        }
    }, [params]);

    return (
        <>
            {staffProfile.articles.length > 0 && staffProfile.illustrations.length > 0 &&
                <div className="flex flex-row items-center justify-center py-4 gap-3 sm:gap-6">
                    <Link href={`${path}?contentType=articles`} shallow={true}>
                        <h1 className={`font-lora text-2xl sm:text-3xl sm:w-32 text-center ${contentType === "articles" ? "text-sky-600" : ""} hover:text-sky-600 cursor-pointer`} onClick={() => setContentType("articles")}>Articles</h1>
                    </Link>

                    <span className="text-black text-xs mx-2"> &bull; </span>

                    <Link href={`${path}?contentType=illustrations`} shallow={true}>
                        <h1 className={`font-lora text-2xl sm:text-3xl sm:w-32 text-center ${contentType === "illustrations" ? "text-sky-600" : ""} hover:text-sky-600 cursor-pointer`} onClick={() => setContentType("illustrations")}>Illustrations</h1>
                    </Link>
                </div>
            }

            {staffProfile.articles.length > 0 && staffProfile.illustrations.length === 0 &&
                <div className="flex items-center justify-center py-4">
                <h1 className="font-lora text-3xl">Articles</h1>
                </div>
            }
            {staffProfile.illustrations.length > 0 &&  staffProfile.articles.length === 0 &&
                <div className="flex items-center justify-center py-4">
                <h1 className="font-lora text-3xl">Illustrations</h1>
                </div>
            }
            {contentType === "articles" && <ArticleList staffProfile={staffProfile}/>}
            {contentType === "illustrations" && <IllustrationList staffProfile={staffProfile}/>}
        </>
    )
}

// list of articles
const ArticleList = ({ staffProfile }: { staffProfile: AuthorProfile }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center max-w-[70%] min-w-[300px]">
        {staffProfile.articles.map((article) => (
          <ProfileArticle key={article.slug} article={article} className="my-4" />
        ))}
      </div>
    </div>
  );
}

// list of articles
const IllustrationList = ({ staffProfile }: { staffProfile: AuthorProfile }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center max-w-[70%] min-w-[300px]">
        {staffProfile.illustrations.map((article) => (
          <ProfileArticle key={article.slug} article={article} className="my-4" />
        ))}
      </div>
    </div>
  );
}