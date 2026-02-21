"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export type Section = "home" | "articles" | "events" | "talks" | "projects" | "contact";

export interface SectionState {
  section: Section;
  articleSlug: string | null;
  talkSlug: string | null;
  navigate: (path: string) => void;
}

export function useSection(): SectionState {
  const pathname = usePathname();
  const router = useRouter();

  const { section, articleSlug, talkSlug } = useMemo(() => {
    if (pathname.startsWith("/articles/") && pathname.length > "/articles/".length) {
      return { section: "articles" as Section, articleSlug: pathname.split("/")[2], talkSlug: null };
    }
    if (pathname.startsWith("/talks/") && pathname.length > "/talks/".length) {
      return { section: "talks" as Section, articleSlug: null, talkSlug: pathname.split("/")[2] };
    }
    if (pathname === "/articles") return { section: "articles" as Section, articleSlug: null, talkSlug: null };
    if (pathname === "/events") return { section: "events" as Section, articleSlug: null, talkSlug: null };
    if (pathname === "/talks") return { section: "talks" as Section, articleSlug: null, talkSlug: null };
    if (pathname === "/projects") return { section: "projects" as Section, articleSlug: null, talkSlug: null };
    if (pathname === "/contact") return { section: "contact" as Section, articleSlug: null, talkSlug: null };
    return { section: "home" as Section, articleSlug: null, talkSlug: null };
  }, [pathname]);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  return { section, articleSlug, talkSlug, navigate };
}
