export type TeamMember = {
  name: string;
  title: string;
  email: string;
  linkedin?: string;
  image?: string;
  bio: string;
};

export type ProjectCard = {
  title: string;
  status?: string;
  people?: string;
  description: string;
  href?: string;
  image?: string;
  posterLabel?: string;
};

export type PortfolioItem = {
  title: string;
  category: string;
  description: string;
  href: string;
  image?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const socialLinks = {
  email: "mailto:quickslate@gmail.com",
  emailLabel: "quickslate@gmail.com",
  instagram: "https://www.instagram.com/quickslatefilms/",
  tiktok: "https://www.tiktok.com/@quickslatefilms",
  linkedin: "https://www.linkedin.com/company/quickslatefilms/",
};

export const serviceItems = [
  {
    title: "Production",
    fee: "Custom quote",
    description:
      "End-to-end production support for branded pieces, narrative work, and digital campaigns.",
  },
  {
    title: "Consulting",
    fee: "Custom quote",
    description:
      "Pre-production planning focused on scripts, boards, schedules, logistics, and creative direction.",
  },
  {
    title: "Distribution",
    fee: "Custom quote",
    description:
      "YouTube-focused release support covering upload strategy, metadata, packaging, and rollout timing.",
  },
  {
    title: "Promotion",
    fee: "Custom quote",
    description:
      "Campaign support across YouTube, Instagram, TikTok, website placements, and other promotional ventures.",
  },
];

export const teamMembers: TeamMember[] = [
  {
    name: "Prayan",
    title: "Team member",
    email: "quickslate@gmail.com",
    linkedin: "#",
    image: "/Prayan 1.jpeg",
    bio: "Original team member from the existing site build, restored with the previous image-based layout in mind.",
  },
  {
    name: "Tyler Wang",
    title: "Team member",
    email: "quickslate@gmail.com",
    linkedin: "#",
    image: "/Tyler.jpg",
    bio: "Core QuickSlate team member and current point of contact on this site update.",
  },
  {
    name: "Arjun",
    title: "Team member",
    email: "quickslate@gmail.com",
    linkedin: "#",
    image: "/Arjun.jpg",
    bio: "Original team member restored from the earlier About page layout.",
  },
  {
    name: "Kellie",
    title: "Team member",
    email: "quickslate@gmail.com",
    linkedin: "#",
    image: "/Kellie 2.jpg",
    bio: "Original team member restored from the earlier About page layout.",
  },
  {
    name: "Amanda Wang",
    title: "Title to be finalized",
    email: "quickslate@gmail.com",
    linkedin: "#",
    bio: "Headshot pending. This card is ready for a future photo without changing the layout.",
  },
];

export const comingSoonProjects: ProjectCard[] = [
  {
    title: "Coming Soon Project 01",
    status: "In development",
    people: "Names to be added",
    description:
      "Reserved slot for a current production in progress. Replace with final title and collaborators when ready.",
  },
  {
    title: "Coming Soon Project 02",
    status: "In development",
    people: "Names to be added",
    description:
      "Second development slot for the landing page pipeline. Built to support title, team credits, and release notes.",
  },
];

export const nowPlayingProjects: ProjectCard[] = [
  {
    title: "QuickSlate Gatorade",
    posterLabel: "Poster link",
    description: "Commercial-style campaign piece currently featured in the QuickSlate portfolio.",
    href: "https://www.canva.com/design/DAGvVwbCatc/mvHo_8A7okWWkJuECniDdA/edit?utm_content=DAGvVwbCatc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "Fortune Heist",
    posterLabel: "Poster link",
    description: "Narrative project available in the current poster archive.",
    href: "https://www.canva.com/design/DAGxjwopmVo/SLSpkgNVSL9uZ1LhMK25MQ/edit?utm_content=DAGxjwopmVo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "Untitled Poster Study",
    posterLabel: "Poster link",
    description: "Additional promotional design in the current showcase set.",
    href: "https://www.canva.com/design/DAGxkAolUII/0KLRk2B0aVz9zI0ykQvlrQ/edit?utm_content=DAGxkAolUII&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "The Reunion",
    posterLabel: "Poster link",
    description: "Narrative short included in the promotional poster lineup.",
    href: "https://www.canva.com/design/DAGxHbTD0PQ/suuOqurd5GLdIgO1qVDxKQ/edit?utm_content=DAGxHbTD0PQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "DECKED",
    posterLabel: "Poster link",
    description: "Poster and campaign concept highlighted in the portfolio section.",
    href: "https://www.canva.com/design/DAGwik1hMsM/070jWU63vl80gAdE4UR0Dw/edit?utm_content=DAGwik1hMsM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "STUCK",
    posterLabel: "Poster link",
    description: "Narrative poster entry ready to be swapped to a local asset later.",
    href: "https://www.canva.com/design/DAGwQR2FJHo/ecGqFJYy7bdtA3DUsBakoA/edit?utm_content=DAGwQR2FJHo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
];

export const portfolioCarouselItems: PortfolioItem[] = [
  {
    title: "QuickSlate Gatorade",
    category: "Poster / Campaign",
    description: "Featured campaign poster. Replace with a public image asset whenever it is ready.",
    href: "https://www.canva.com/design/DAGvVwbCatc/mvHo_8A7okWWkJuECniDdA/edit?utm_content=DAGvVwbCatc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "Fortune Heist",
    category: "Poster / Narrative",
    description: "Narrative poster piece held in the main carousel rotation.",
    href: "https://www.canva.com/design/DAGxjwopmVo/SLSpkgNVSL9uZ1LhMK25MQ/edit?utm_content=DAGxjwopmVo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "The Reunion",
    category: "Poster / Narrative",
    description: "Promotional art slide prepared for a future local poster asset.",
    href: "https://www.canva.com/design/DAGxHbTD0PQ/suuOqurd5GLdIgO1qVDxKQ/edit?utm_content=DAGxHbTD0PQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "DECKED",
    category: "Poster / Campaign",
    description: "Designed as a rotating highlight until final imagery lands in `public/`.",
    href: "https://www.canva.com/design/DAGwik1hMsM/070jWU63vl80gAdE4UR0Dw/edit?utm_content=DAGwik1hMsM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    title: "STUCK",
    category: "Poster / Narrative",
    description: "Additional carousel entry for the current poster slate.",
    href: "https://www.canva.com/design/DAGwQR2FJHo/ecGqFJYy7bdtA3DUsBakoA/edit?utm_content=DAGwQR2FJHo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
];

export const portfolioLinks: PortfolioItem[] = [
  {
    title: "Product Spot",
    category: "Instagram",
    description: "Product-focused social spot.",
    href: "https://www.instagram.com/p/DOOlUyBES_p/",
  },
  {
    title: "Brand Film",
    category: "Instagram",
    description: "Brand-driven visual storytelling piece.",
    href: "https://www.instagram.com/p/DNYmiWlPwcQ/",
  },
  {
    title: "Social Cut",
    category: "Instagram",
    description: "Short-form promo cut made for social distribution.",
    href: "https://www.instagram.com/p/DNLoUsVxjTA/",
  },
  {
    title: "Narrative Short 01",
    category: "YouTube",
    description: "Narrative short in the YouTube portfolio lineup.",
    href: "https://youtu.be/oYA8VLEfPwY?si=S9Vk7fLIYpLJ8EzP",
  },
  {
    title: "Narrative Short 02",
    category: "YouTube",
    description: "Narrative short in the YouTube portfolio lineup.",
    href: "https://youtu.be/QaDy-D31-Tk?si=iGiAFvjyNccyrDMW",
  },
  {
    title: "Narrative Short 03",
    category: "YouTube",
    description: "Narrative short in the YouTube portfolio lineup.",
    href: "https://youtu.be/NvqE3ziWZjY?si=kT1Q1hN00avjNdiy",
  },
  {
    title: "Narrative Short 04",
    category: "YouTube",
    description: "Narrative short in the YouTube portfolio lineup.",
    href: "https://youtu.be/_GyPKI-SXxI?si=AINkkf30tYPuVH6T",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "What does QuickSlate do?",
    answer:
      "QuickSlate develops branded, promotional, and narrative video work across production, planning, release, and promotion.",
  },
  {
    question: "Do you only work on full productions?",
    answer:
      "No. The services section is structured to support anything from pre-production consulting to distribution and promotion.",
  },
  {
    question: "Where do projects get released?",
    answer:
      "The current pipeline references YouTube, Instagram, TikTok, the QuickSlate website, and other tailored promotional channels.",
  },
  {
    question: "Can we ask about pricing now?",
    answer:
      "Yes. The service cards leave room for fees, and the current site positions each engagement around a custom quote.",
  },
];
