import ImageReveal from "@/components/animations/ImageReveal";
import MotionSection from "@/components/animations/MotionSection";
import ParallaxDrift from "@/components/animations/ParallaxDrift";
import type { TeamMember } from "@/types/content";
import Image from "next/image";
import styles from "./TeamSection.module.css";

interface Props {
  members: TeamMember[];
}

export default function TeamSection({ members }: Props) {
  // For Zona Gráfica, there's only one member: Jesús
  const member = members[0];
  if (!member) return null;

  return (
    <MotionSection className={styles.section} data-theme="cream">
      <div className={styles.inner}>
        <div className={styles.labelRow}>
          <span className={styles.number}>(03)</span>
          <span className={styles.label}>Quién está detrás</span>
        </div>

        <div className={styles.portrait}>
          {member.image && (
            <ImageReveal
              direction="left"
              duration={1.4}
              className={styles.imageWrap}
            >
              <ParallaxDrift
                distance={20}
                className={styles.parallaxWrap}
                style={{ height: "100%" }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={480}
                  height={600}
                  className={styles.image}
                />
              </ParallaxDrift>
            </ImageReveal>
          )}

          <div className={styles.info}>
            <h2 className={styles.name}>{member.name}</h2>
            <span className={styles.role}>{member.role}</span>
            <div className={styles.divider} />
            <p className={styles.bio}>{member.bio}</p>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
