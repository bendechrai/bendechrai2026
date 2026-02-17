export interface Article {
  title: string;
  date: string;
  summary: string;
}

export interface Event {
  name: string;
  date: string;
  location: string;
  role: "speaking" | "workshop" | "attending";
  talk?: string;
}

export interface Talk {
  title: string;
  type: "talk" | "workshop";
  event: string;
  date: string;
  description: string;
}

export const SOCIAL_LINKS = {
  github: "https://github.com/bendechrai",
  linkedin: "https://www.linkedin.com/in/bendechrai/",
  twitter: "https://twitter.com/bendechrai",
} as const;

export const ARTICLES: Article[] = [
  {
    title: "Building Passwordless Auth with WebAuthn",
    date: "2026-01-15",
    summary:
      "A deep dive into implementing FIDO2 WebAuthn for seamless, passwordless user authentication.",
  },
  {
    title: "The State of Developer Experience in 2026",
    date: "2025-12-03",
    summary:
      "Reflections on how DX tooling has evolved and where it's heading next.",
  },
  {
    title: "Privacy-First Architecture for Modern Web Apps",
    date: "2025-10-18",
    summary:
      "Practical patterns for building applications that respect user privacy by default.",
  },
  {
    title: "Rust for Web Developers: A Practical Guide",
    date: "2025-08-22",
    summary:
      "Why Rust is worth learning even if you live in JavaScript-land, with real-world examples.",
  },
  {
    title: "Why Your Smart Lock Needs Better Auth",
    date: "2025-06-10",
    summary:
      "IoT security is still a mess. Here's what manufacturers keep getting wrong.",
  },
];

export const EVENTS: Event[] = [
  {
    name: "NDC Sydney",
    date: "2026-03-17",
    location: "Sydney, AU",
    role: "speaking",
    talk: "Zero Trust Authentication for the Modern Web",
  },
  {
    name: "Web Directions Summit",
    date: "2026-04-08",
    location: "Melbourne, AU",
    role: "speaking",
    talk: "The Art of Developer Advocacy",
  },
  {
    name: "DDD Melbourne",
    date: "2026-06-20",
    location: "Melbourne, AU",
    role: "workshop",
    talk: "Building with WebAuthn: Hands-On Workshop",
  },
  {
    name: "JSConf Australia",
    date: "2026-08-12",
    location: "Melbourne, AU",
    role: "speaking",
    talk: "Securing the Edge: Auth at the CDN Layer",
  },
];

export const TALKS: Talk[] = [
  {
    title: "Zero Trust Authentication for the Modern Web",
    type: "talk",
    event: "NDC Sydney 2026",
    date: "2026-03-17",
    description:
      "Exploring zero-trust principles applied to web authentication, from mTLS to WebAuthn.",
  },
  {
    title: "The Art of Developer Advocacy",
    type: "talk",
    event: "Web Directions Summit 2026",
    date: "2026-04-08",
    description:
      "What makes developer advocacy effective, and how to bridge the gap between product and community.",
  },
  {
    title: "Building with WebAuthn: Hands-On Workshop",
    type: "workshop",
    event: "DDD Melbourne 2026",
    date: "2026-06-20",
    description:
      "A 3-hour hands-on workshop building a complete passwordless auth system from scratch.",
  },
  {
    title: "Securing the Edge: Auth at the CDN Layer",
    type: "talk",
    event: "JSConf Australia 2026",
    date: "2026-08-12",
    description:
      "Moving authentication decisions to the edge for faster, more resilient web applications.",
  },
];
