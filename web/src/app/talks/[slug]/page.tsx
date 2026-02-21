import ThemePage from "@/components/ThemePage";
import { TALKS } from "@/data/content";

export function generateStaticParams() {
  return TALKS.map((t) => ({ slug: t.slug }));
}

export default function TalkDetailPage() {
  return <ThemePage />;
}
