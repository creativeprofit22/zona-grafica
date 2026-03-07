"use client";

import type { Project } from "@/types/content";
import { useMemo, useState } from "react";
import ProjectFilter from "./ProjectFilter";
import ProjectGrid from "./ProjectGrid";

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

  return (
    <>
      <ProjectFilter
        categories={categories}
        active={active}
        onSelect={setActive}
        counts={counts}
      />
      <ProjectGrid projects={filtered} />
    </>
  );
}
