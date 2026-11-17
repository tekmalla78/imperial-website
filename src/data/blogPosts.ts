export type BlogPost = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    title: "Mutual Fund- A Boon Or A Bane In Nepalese Context",
    excerpt:
      "A published Imperial Securities note on mutual funds in Nepal — for general information, not personalised advice.",
    category: "Analysis",
    date: "Dec 01, 2023",
    author: "Imperial Securities",
    readTime: "8 min",
  },
  {
    title: "NEPSE: The Game of Narrative",
    excerpt:
      "A published Imperial Securities article on narrative and Nepal's stock market.",
    category: "Analysis",
    date: "Nov 08, 2023",
    author: "Imperial Securities",
    readTime: "8 min",
  },
];

export const blogCategoryColors: Record<string, string> = {
  Education: "bg-brand-blue-lt text-brand-blue",
  Analysis: "bg-brand-green-lt text-brand-green-dk",
  Guide: "bg-brand-blue-lt text-brand-blue-dk",
  Strategy: "bg-brand-green-lt text-brand-green-dk",
  Announcement: "bg-brand-green-lt text-brand-green-dk",
  Corporate: "bg-brand-blue-lt text-brand-blue",
};
