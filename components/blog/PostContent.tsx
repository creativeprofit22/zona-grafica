import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import MotionSection from "@/components/animations/MotionSection";
import styles from "./PostContent.module.css";

interface Props {
  source: string;
  gradientFrom?: string;
}

const mdxComponents: MDXComponents = {
  h2: (props) => (
    <MotionSection variant="fade-up">
      <h2 {...props} />
    </MotionSection>
  ),
};

export default function PostContent({ source, gradientFrom }: Props) {
  return (
    <article
      className={styles.article}
      style={
        {
          "--post-gradient": gradientFrom || "var(--accent)",
        } as React.CSSProperties
      }
    >
      <div className={styles.prose}>
        <MDXRemote
          source={source}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: "github-dark-dimmed",
                    keepBackground: true,
                  },
                ],
              ],
            },
          }}
        />
      </div>
    </article>
  );
}
