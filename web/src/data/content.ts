export interface Article {
  title: string;
  slug: string;
  date: string;
  summary: string;
  body: string;
  image: string;
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

export interface Project {
  name: string;
  url: string;
  status: "Live" | "Beta" | "Public Beta";
  tagline: string;
  description: string;
  tech: string[];
  category: "fintech" | "devtools" | "ai";
}

export const PROJECTS: Project[] = [
  {
    name: "Sinking Fund",
    url: "https://sinkingfund.up.railway.app/",
    status: "Live",
    tagline: "Never be caught off guard by a bill again",
    description: "A personal finance planner that calculates exactly what to set aside each pay cycle so every obligation is covered before it hits. Features fund health tracking, balance projections, and upcoming obligation alerts. Built for the Anthropic Claude Code hackathon in Feb 2026.",
    tech: ["TypeScript", "Node.js", "Railway"],
    category: "fintech",
  },
  {
    name: "VENNmoney",
    url: "https://vennmoney.com/",
    status: "Beta",
    tagline: "Money Matters. Find Your Perspective.",
    description: "A gamified personal finance education platform designed as a not-for-profit tool that teaches people how money actually works. Built from years of creating complex budget spreadsheets and a belief that financial literacy shouldn't be boring or inaccessible.",
    tech: ["TypeScript", "Node.js"],
    category: "fintech",
  },
  {
    name: "Deplotify",
    url: "https://deplotify.com/",
    status: "Public Beta",
    tagline: "Never miss a deployment again",
    description: "A deployment notification SaaS for engineering teams. Get instant alerts when deployments succeed or fail, delivered to Discord and Email, with more to come! Free tier includes 5 projects and 250 notifications/month.",
    tech: ["TypeScript", "Node.js", "Discord API"],
    category: "devtools",
  },
  {
    name: "BraidFlow",
    url: "https://braidflow.io/",
    status: "Beta",
    tagline: "Finally, chats that actually go somewhere",
    description: "An AI-powered conversation platform that turns meandering discussions into clear decisions. Uses multi-actor LLM orchestration with specialized AI personas that know when to jump in and when to stay quiet, solving context drift and poisoning in team communication.",
    tech: ["TypeScript", "Node.js", "LLM Orchestration", "PostgreSQL"],
    category: "ai",
  },
];

export const SOCIAL_LINKS = {
  github: "https://github.com/bendechrai",
  linkedin: "https://www.linkedin.com/in/bendechrai/",
  twitter: "https://twitter.com/bendechrai",
} as const;

export const ARTICLES: Article[] = [
  {
    title: "Building Passwordless Auth with WebAuthn",
    slug: "passwordless-webauthn",
    date: "2026-01-15",
    summary:
      "A deep dive into implementing FIDO2 WebAuthn for seamless, passwordless user authentication.",
    image: "https://picsum.photos/seed/webauthn-security/800/400",
    body: `Passwords are the weakest link in modern authentication. They get reused, phished, leaked in breaches, and forgotten at the worst possible moments. WebAuthn, part of the FIDO2 specification, offers a fundamentally better approach.

WebAuthn works by generating a unique public-private key pair for each site. The private key never leaves the user's device — it lives in a secure enclave on their phone, laptop, or hardware security key. When they sign in, the browser asks the authenticator to sign a challenge, and the server verifies it against the stored public key. No shared secret ever crosses the wire.

I've been implementing WebAuthn in production for the past two years, and the developer experience has improved dramatically. The browser APIs are well-documented, the spec has stabilised, and libraries like SimpleWebAuthn make server-side integration straightforward.

The biggest challenge isn't technical — it's UX. Users need to understand what's happening when the browser prompts them to touch their fingerprint sensor or insert a security key. The registration flow matters enormously. I've found that framing it as "save this device" rather than "register a credential" leads to significantly higher adoption rates.

One pattern that works well is progressive enhancement: let users sign up with a traditional password, then prompt them to add a passkey during their second or third visit. Once they experience the speed of biometric sign-in, most never go back.

If you're building authentication today, there's no reason not to support WebAuthn alongside traditional methods. The spec is mature, browser support is universal, and your users will thank you.`,
  },
  {
    title: "The State of Developer Experience in 2026",
    slug: "dx-2026",
    date: "2025-12-03",
    summary:
      "Reflections on how DX tooling has evolved and where it's heading next.",
    image: "https://picsum.photos/seed/developer-tools/800/400",
    body: `Developer experience has become a first-class concern in the software industry, and 2026 feels like a turning point. The tools we use daily have evolved from "good enough" to genuinely delightful, and the gap between the best and worst DX is wider than ever.

The biggest shift I've observed is the rise of AI-assisted development. Not as a replacement for thinking, but as an accelerator for the tedious parts. Code generation, test scaffolding, documentation — these are areas where AI genuinely saves time without introducing the kind of subtle bugs that make you regret using it.

Type systems have won. TypeScript is the default for new web projects. Rust is eating into systems programming. Even Python has embraced type hints in a meaningful way. The result is that entire categories of bugs simply don't happen anymore, and editors can provide vastly better autocomplete and refactoring support.

Build tools have finally gotten fast. The Rust-based bundlers (Turbopack, Rspack) and native-speed linters (Biome, oxlint) mean that the feedback loop between writing code and seeing results is now measured in milliseconds, not seconds.

What still needs work? Configuration. We've traded XML hell for YAML hell for TypeScript config hell. Every tool has its own config format, its own plugin system, its own mental model. The industry desperately needs convergence here.

The other gap is onboarding. It still takes new developers days or weeks to get productive in a codebase. Better tooling can help, but the real solution is better architecture — codebases that are navigable by design, not just by tribal knowledge.

Looking ahead, I expect 2027 to bring tighter integration between development and deployment. The line between "local dev" and "production" is blurring, and that's a good thing.`,
  },
  {
    title: "Privacy-First Architecture for Modern Web Apps",
    slug: "privacy-first-architecture",
    date: "2025-10-18",
    summary:
      "Practical patterns for building applications that respect user privacy by default.",
    image: "https://picsum.photos/seed/privacy-architecture/800/400",
    body: `Privacy isn't a feature you bolt on after launch. It's an architectural decision that affects every layer of your application, from the database schema to the API design to the way you handle logs.

The principle is simple: collect the minimum data necessary, store it for the minimum time required, and give users meaningful control over what you keep. In practice, this means rethinking patterns that most developers take for granted.

Start with your data model. For every field you store, ask: do we need this? For how long? Can we derive it instead of storing it? User analytics, for example, can often be collected as aggregates rather than individual events. You lose some granularity but gain enormous privacy benefits.

Encryption at rest is table stakes, but think about who holds the keys. End-to-end encryption, where the server never sees plaintext data, is achievable for more use cases than you might think. Messaging, notes, file storage — all of these can be designed so that only the user can decrypt their data.

Authentication is another area where privacy matters. Passwordless auth with WebAuthn is inherently more private than email-based flows because it doesn't require the server to store a shared secret. OAuth flows, on the other hand, often leak more information than necessary through ID tokens.

One pattern I've found particularly effective is "privacy by deletion." Instead of complex retention policies, build your system so that deleting a user account genuinely removes all their data. This sounds obvious, but in practice it means thinking carefully about foreign keys, backups, logs, and third-party integrations.

The regulatory landscape (GDPR, CCPA, and their successors) is making privacy-first architecture not just ethical but legally necessary. The companies that build it in from day one will have a significant competitive advantage over those scrambling to retrofit it later.`,
  },
  {
    title: "Rust for Web Developers: A Practical Guide",
    slug: "rust-for-web-devs",
    date: "2025-08-22",
    summary:
      "Why Rust is worth learning even if you live in JavaScript-land, with real-world examples.",
    image: "https://picsum.photos/seed/rust-programming/800/400",
    body: `If you're a web developer who's been curious about Rust but intimidated by the learning curve, this is for you. I spent six months writing Rust full-time after a decade of JavaScript, and I want to share what I wish someone had told me at the start.

First: yes, the borrow checker is annoying at first. It will reject code that you know is correct. But here's the thing — it's usually rejecting code that's correct today but fragile tomorrow. The patterns Rust pushes you towards (explicit ownership, no shared mutable state, exhaustive error handling) produce code that's dramatically more reliable than what I was writing in JavaScript.

The web ecosystem in Rust is maturing fast. Axum for HTTP servers is excellent — it's type-safe, async, and composes beautifully with the tower middleware ecosystem. For database access, sqlx gives you compile-time checked SQL queries, which is genuinely magical the first time you see a typo caught at build time instead of runtime.

Where Rust really shines for web developers is performance-sensitive code. I recently rewrote a Node.js image processing pipeline in Rust and saw a 40x improvement in throughput with a 10x reduction in memory usage. Not everything needs that kind of performance, but when you do, Rust delivers.

The tooling is superb. Cargo is the best package manager I've used in any language. The compiler error messages are genuinely helpful — they don't just tell you what's wrong, they suggest how to fix it. And rust-analyzer provides IDE support that's on par with TypeScript's language server.

My advice for getting started: don't try to learn everything at once. Start with a small CLI tool or a simple API server. Get comfortable with ownership and lifetimes in a low-stakes context before trying to build something complex.

The investment pays off. Rust has made me a better programmer in every language I use, because it forced me to think about data ownership and error handling in ways I'd been avoiding for years.`,
  },
  {
    title: "Why Your Smart Lock Needs Better Auth",
    slug: "smart-lock-auth",
    date: "2025-06-10",
    summary:
      "IoT security is still a mess. Here's what manufacturers keep getting wrong.",
    image: "https://picsum.photos/seed/iot-smart-lock/800/400",
    body: `I recently spent a weekend reverse-engineering the authentication protocol of a popular smart lock, and what I found was depressing. A device that's supposed to protect your home was using security practices that would have been considered inadequate a decade ago.

The lock communicated over Bluetooth Low Energy using a fixed PIN that was derived from the device's MAC address. Anyone within range could sniff the pairing process and compute the PIN. The companion app stored credentials in plain text in a SQLite database. The cloud API used API keys embedded in the app binary with no certificate pinning.

This isn't an outlier. I've audited a dozen IoT devices over the past year, and the pattern is consistent: manufacturers treat security as an afterthought, something to be addressed after the hardware ships and the firmware is frozen.

The fundamental problem is that IoT devices face a unique set of constraints. They have limited processing power, they need to work offline, they're difficult to update, and they have a lifespan measured in years. Traditional web authentication patterns don't translate directly.

But better solutions exist. FIDO Device Onboard (FDO) provides a standard for secure device provisioning. Matter and Thread offer authenticated communication protocols designed for constrained devices. Secure enclaves (ARM TrustZone, for example) can protect credentials even on cheap microcontrollers.

The real issue is incentives. Consumers buy smart locks based on features and price, not security audits. Until there are meaningful consequences for shipping insecure devices — whether through regulation, liability, or consumer awareness — manufacturers will continue to cut corners.

What can you do? If you're choosing IoT devices, look for ones that support automatic firmware updates, use established protocols (Matter, Thread), and have a published vulnerability disclosure policy. If you're building IoT products, please invest in security review before you ship. Your users' physical safety may depend on it.`,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

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
