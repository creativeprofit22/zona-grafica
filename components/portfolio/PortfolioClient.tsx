"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Project } from "@/types/content";

// Flip type is globally declared by gsap/types/flip.d.ts
// Using require to avoid TS1149 casing conflict on case-insensitive filesystems
// eslint-disable-next-line @typescript-eslint/no-require-imports
const FlipPlugin: typeof Flip = require("gsap/Flip").default;

import { useCallback, useMemo, useRef, useState } from "react";
import ProjectFilter from "./ProjectFilter";
import ProjectGrid from "./ProjectGrid";

gsap.registerPlugin(FlipPlugin);

interface Category {
  slug: string;
  label: string;
}

interface Props {
  projects: Project[];
  categories: readonly Category[];
}

export default function PortfolioClient({ projects, categories }: Props) {
  const [active, setActive] = useState("todos");
  const gridRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of projects) {
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, [projects]);

  const filtered = useMemo(() => {
    if (active === "todos") return projects;
    return projects.filter((p) => p.category === active);
  }, [projects, active]);

  const handleSelect = useCallback((slug: string) => {
    if (!gridRef.current) {
      setActive(slug);
      return;
    }
    flipStateRef.current = FlipPlugin.getState(
      gridRef.current.querySelectorAll("[data-flip-id]"),
    );
    setActive(slug);
  }, []);

  useGSAP(
    () => {
      if (!flipStateRef.current || !gridRef.current) return;

      const items = gridRef.current.querySelectorAll("[data-flip-id]");

      FlipPlugin.from(flipStateRef.current, {
        targets: items,
        scale: true,
        absolute: true,
        duration: 0.5,
        ease: "power2.inOut",
        stagger: 0.05,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4 },
          ),
        onLeave: (elements) =>
          gsap.to(elements, { opacity: 0, scale: 0.9, duration: 0.3 }),
      });

      flipStateRef.current = null;
    },
    { scope: gridRef, dependencies: [active] },
  );

  return (
    <>
      <ProjectFilter
        categories={categories}
        active={active}
        onSelect={handleSelect}
        counts={counts}
      />
      <ProjectGrid projects={filtered} gridRef={gridRef} />
    </>
  );
}
