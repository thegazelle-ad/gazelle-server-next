import { getCategoryArticles } from "../../../db/queries/articles";

export default async function Page() {
  const articles = await getCategoryArticles("features");
  console.log(articles)
  return <h1>Features</h1>;
}
