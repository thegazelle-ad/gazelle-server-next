export const revalidate = 43200;
export const runtime = "nodejs";
export const preferredRegion = "fra1";
export const dynamic = "error";

import { getCategoryArticles } from "../../db/queries/articles";
import { MasonryListOfArticles } from "../../components/ListOfArticles";

export async function generateMetadata() {
	const articles = await getCategoryArticles("opinion");

	const images = articles.map((article) => article.image);

	return {
		title: `${articles[0].categoryName} | The Gazelle`,
		description: `The latest articles from The Gazelle in from the ${articles[0].categoryName} desk.`,
		openGraph: {
			title: `${articles[0].categoryName} | The Gazelle`,
			description: `The latest articles from The Gazelle in from the ${articles[0].categoryName} desk.`,
			images: images.slice(0, 3),
		},
	};
}

export default async function Page() {
	const articles = await getCategoryArticles("opinion");

	return (
		<>
			<MasonryListOfArticles
				title={articles[0].categoryName}
				articles={articles}
			/>
		</>
	);
}
