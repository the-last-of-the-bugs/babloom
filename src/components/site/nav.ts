export interface DocsNavItem {
  title: string;
  href: string;
}

export interface DocsNavSection {
  title: string;
  items: DocsNavItem[];
}

export const docsNav: DocsNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Architecture", href: "/docs/architecture" },
    ],
  },
  {
    title: "Frameworks",
    items: [
      { title: "React", href: "/docs/react" },
      { title: "Vue", href: "/docs/vue" },
      { title: "Svelte", href: "/docs/svelte" },
    ],
  },
  {
    title: "Features",
    items: [
      { title: "Extensions", href: "/docs/extensions" },
      { title: "Image Upload", href: "/docs/image-upload" },
      { title: "Serialization", href: "/docs/serialization" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Editor API", href: "/docs/api" },
      { title: "Publishing to npm", href: "/docs/publishing" },
    ],
  },
];
