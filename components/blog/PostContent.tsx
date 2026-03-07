import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import styles from "./PostContent.module.css";

interface Props {
  source: string;
}

export default function PostContent({ source }: Props) {
  return (
    <article className={styles.article}>
      <div className={styles.prose}>
        <MDXRemote
          source={source}
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
