import ThemePage from "@/components/ThemePage";
import { ARTICLES } from "@/data/content";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default function ArticleDetailPage() {
  return <ThemePage />;
}
