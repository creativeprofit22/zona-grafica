import MotionSection from "@/components/animations/MotionSection";
import styles from "./ServicesProcess.module.css";

const steps = [
  {
    number: "01",
    title: "Escuchamos",
    description:
      "Entendemos tu negocio, tu audiencia y tus objetivos antes de tocar un solo pixel.",
  },
  {
    number: "02",
    title: "Investigamos",
    description:
      "Analizamos el mercado, la competencia y las oportunidades para definir la estrategia.",
  },
  {
    number: "03",
    title: "Creamos",
    description:
      "Diseñamos, iteramos y refinamos hasta que cada pieza comunique exactamente lo que debe.",
  },
  {
    number: "04",
    title: "Entregamos",
    description:
      "Archivos listos para producción, guías de uso y soporte post-entrega incluido.",
  },
];

export default function ServicesProcess() {
  return (
    <MotionSection className={styles.section} data-theme="cream" stagger>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>(proceso)</span>
          <h2 className={styles.title}>Así trabajamos</h2>
        </div>

        <ol className={styles.list}>
          {steps.map((step) => (
            <li key={step.number} className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
              </div>
              <p className={styles.stepDescription}>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </MotionSection>
  );
}
