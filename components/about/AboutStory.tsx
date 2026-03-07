import MotionSection from "@/components/animations/MotionSection";
import styles from "./AboutStory.module.css";

interface Props {
  body: string;
}

export default function AboutStory({ body }: Props) {
  // Split body into paragraphs at natural break points for editorial flow
  const sentences = body.split(". ").filter(Boolean);
  const mid = Math.ceil(sentences.length / 2);
  const para1 = `${sentences.slice(0, mid).join(". ")}.`;
  const para2 = `${sentences.slice(mid).join(". ")}`;

  return (
    <MotionSection className={styles.section} data-theme="cream">
      <div className={styles.inner}>
        <div className={styles.labelRow}>
          <span className={styles.number}>(01)</span>
          <span className={styles.label}>La historia</span>
        </div>

        <div className={styles.content}>
          <div className={styles.pullQuote}>
            <span className={styles.quoteMarks}>"</span>
            <blockquote className={styles.quote}>
              El buen diseño no es un lujo — es la forma más honesta de
              comunicar.
            </blockquote>
          </div>

          <div className={styles.text}>
            <p className={styles.body}>{para1}</p>
            <p className={styles.body}>{para2}</p>
          </div>
        </div>

        <div className={styles.milestones}>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>22</span>
            <span className={styles.milestoneLabel}>
              años diseñando
              <br />
              la imagen del GIFF
            </span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>33</span>
            <span className={styles.milestoneLabel}>
              edición del Cervantino
              <br />— nuestro cartel
            </span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>475</span>
            <span className={styles.milestoneLabel}>
              aniversario de SMA
              <br />— libro conmemorativo
            </span>
          </div>
          <div className={styles.milestone}>
            <span className={styles.milestoneValue}>5</span>
            <span className={styles.milestoneLabel}>
              libros de arte
              <br />
              publicados
            </span>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
