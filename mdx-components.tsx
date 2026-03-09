import type { MDXComponents } from "mdx/types";
import { AuthorAside } from "@/components/blog/mdx/AuthorAside";
import { Callout } from "@/components/blog/mdx/Callout";
import { Gallery } from "@/components/blog/mdx/Gallery";
import { PullQuote } from "@/components/blog/mdx/PullQuote";
import { Stat } from "@/components/blog/mdx/Stat";
import { VideoEmbed } from "@/components/blog/mdx/VideoEmbed";

export function useMDXComponents(): MDXComponents {
  return { AuthorAside, Callout, Gallery, PullQuote, Stat, VideoEmbed };
}
