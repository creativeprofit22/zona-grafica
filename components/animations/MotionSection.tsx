"use client";

import { type ReactNode, useEffect, useRef } from "react";

type RevealVariant =
  | "fade-up"
  | "slide-left"
  | "slide-right"
  | "clip-up"
  | "scale-in"
  | "blur-in";

interface Props {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  as?: "section" | "div" | "footer";
  /** When true, child elements stagger in one by one (CSS-only, 0.1s increments). */
  stagger?: boolean;
  /** Reveal animation variant. Defaults to "fade-up". */
  variant?: RevealVariant;
  /** Color-scheme override for this section. */
  "data-theme"?: "light" | "cream" | "dark";
  /** Called once when the section becomes visible. */
  onVisible?: () => void;
}

export default function MotionSection({
  children,
  className,
  style,
  id,
  as: Tag = "section",
  stagger = false,
  variant,
  "data-theme": dataTheme,
  onVisible,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const onVisibleRef = useRef(onVisible);
  onVisibleRef.current = onVisible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          onVisibleRef.current?.();
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLDivElement>}
      data-animate=""
      data-reveal={variant || undefined}
      data-stagger={stagger ? "" : undefined}
      data-theme={dataTheme}
      className={className}
      style={style}
      id={id}
    >
      {children}
    </Tag>
  );
}
