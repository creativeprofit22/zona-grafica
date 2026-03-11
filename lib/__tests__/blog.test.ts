import fs from "fs";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock react cache to be a passthrough
vi.mock("react", () => ({
  cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

// Mock fs
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}));

const mockPost1 = `---
title: Post One
excerpt: First post excerpt
category: Design
date: "1 Mar 2026"
isoDate: "2026-03-01"
gradientFrom: "#111"
gradientTo: "#222"
featured: true
---

This is the content of post one with enough words to test reading time.
`;

const mockPost2 = `---
title: Post Two
excerpt: Second post excerpt
category: Branding
date: "5 Mar 2026"
isoDate: "2026-03-05"
---

Content for post two.
`;

describe("blog", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mocked(fs.existsSync).mockReset();
    vi.mocked(fs.readdirSync).mockReset();
    vi.mocked(fs.readFileSync).mockReset();
  });

  describe("estimateReadingTime (tested via getPostBySlug)", () => {
    it("returns 1 min for short content", async () => {
      const shortPost = `---
title: Short
excerpt: Short
category: Test
date: "1 Jan 2026"
isoDate: "2026-01-01"
---

Hello world.
`;
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(shortPost);

      const { getPostBySlug } = await import("../blog");
      const result = getPostBySlug("short-post");
      expect(result).not.toBeNull();
      expect(result!.meta.readingTime).toBe("1 min");
    });

    it("calculates correctly for longer content", async () => {
      // 400 words = ~2 min at 200 wpm
      const words = Array(400).fill("word").join(" ");
      const longPost = `---
title: Long
excerpt: Long
category: Test
date: "1 Jan 2026"
isoDate: "2026-01-01"
---

${words}
`;
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(longPost);

      const { getPostBySlug } = await import("../blog");
      const result = getPostBySlug("long-post");
      expect(result).not.toBeNull();
      expect(result!.meta.readingTime).toBe("2 min");
    });

    it("uses readingTime from frontmatter when provided", async () => {
      const postWithTime = `---
title: Timed
excerpt: Timed
category: Test
date: "1 Jan 2026"
isoDate: "2026-01-01"
readingTime: "5 min"
---

Short content.
`;
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(postWithTime);

      const { getPostBySlug } = await import("../blog");
      const result = getPostBySlug("timed-post");
      expect(result!.meta.readingTime).toBe("5 min");
    });
  });

  describe("getPostBySlug", () => {
    it("rejects path traversal slugs", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);

      const { getPostBySlug } = await import("../blog");
      expect(getPostBySlug("../etc/passwd")).toBeNull();
      expect(getPostBySlug("..")).toBeNull();
      expect(getPostBySlug("foo/bar")).toBeNull();
      expect(getPostBySlug(".hidden")).toBeNull();
    });

    it("returns null for non-existent files", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const { getPostBySlug } = await import("../blog");
      expect(getPostBySlug("does-not-exist")).toBeNull();
    });

    it("returns post data for valid slug", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(mockPost1);

      const { getPostBySlug } = await import("../blog");
      const result = getPostBySlug("post-one");
      expect(result).not.toBeNull();
      expect(result!.meta.title).toBe("Post One");
      expect(result!.meta.slug).toBe("post-one");
      expect(result!.meta.category).toBe("Design");
      expect(result!.meta.featured).toBe(true);
      expect(result!.meta.gradientFrom).toBe("#111");
      expect(result!.meta.gradientTo).toBe("#222");
      expect(result!.content).toContain("content of post one");
    });
  });

  describe("getAllPosts", () => {
    it("returns empty array when blog dir does not exist", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const { getAllPosts } = await import("../blog");
      expect(getAllPosts()).toEqual([]);
    });

    it("returns posts sorted by date descending", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        "post-one.mdx",
        "post-two.mdx",
      ] as unknown as ReturnType<typeof fs.readdirSync>);
      vi.mocked(fs.readFileSync).mockImplementation(
        (filePath: fs.PathOrFileDescriptor) => {
          if (String(filePath).includes("post-one")) return mockPost1;
          if (String(filePath).includes("post-two")) return mockPost2;
          return "";
        },
      );

      const { getAllPosts } = await import("../blog");
      const posts = getAllPosts();
      expect(posts).toHaveLength(2);
      // Post Two (2026-03-05) should come before Post One (2026-03-01)
      expect(posts[0].title).toBe("Post Two");
      expect(posts[1].title).toBe("Post One");
    });

    it("filters non-mdx files", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        "post-one.mdx",
        "readme.txt",
        ".DS_Store",
      ] as unknown as ReturnType<typeof fs.readdirSync>);
      vi.mocked(fs.readFileSync).mockReturnValue(mockPost1);

      const { getAllPosts } = await import("../blog");
      const posts = getAllPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe("post-one");
    });
  });
});
