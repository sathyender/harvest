"use client";

const sections = [
  ["Harvest", "harvest"],
  ["Fruit match", "fruit-match"],
  ["Home", "home"],
  ["Best fruits", "best-fruits"],
  ["Seasons", "seasons"],
  ["Calendar", "calendar"],
  ["Our story", "story"],
] as const;

type SectionId = (typeof sections)[number][1];

export function SectionNav({ activeSection, onSelect }: { activeSection: string; onSelect: (section: string) => void }) {
  return <nav className="section-nav" role="tablist" aria-label="Home page sections">
    {sections.map(([label, id]) => <button key={id} type="button" role="tab" id={`section-tab-${id}`} aria-selected={activeSection === id} aria-controls={`section-panel-${id}`} className={activeSection === id ? "active" : ""} onClick={() => onSelect(id)}>{label}</button>)}
  </nav>;
}