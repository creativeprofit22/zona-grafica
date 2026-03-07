"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  speed?: number;
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
}

export default function ParallaxContainer({
  children,
  speed = 0.15,
  className,
  innerClassName,
  style,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const inner = innerRef.current;
      if (!inner) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px)", () => {
        const distance = 100 * speed;

        gsap.fromTo(
          inner,
          { y: -distance },
          {
            y: distance,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className} style={style}>
      <div ref={innerRef} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
