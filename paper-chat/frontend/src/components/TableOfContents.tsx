import { usePaperReader } from '../context/PaperReaderContext';
import type { PaperSection } from '../types/paper';

const SECTION_NUMBERS: Record<string, string> = {
  introduction: 'I',
  'related-work': 'II',
  'model-methods': 'III',
  results: 'V',
  discussion: 'VI',
  'limitations-future-work': 'VII',
  conclusion: 'VIII',
};

interface Props {
  sections: PaperSection[];
}

export function TableOfContents({ sections }: Props) {
  const { currentSection, scrollToSection } = usePaperReader();

  return (
    <nav className="toc" aria-label="Table of contents">
      <ul className="toc-list">
        {sections.map((sec, index) => {
          const isActive = currentSection === sec.slug;
          const num = SECTION_NUMBERS[sec.slug];
          return (
            <li key={sec.slug}>
              <button
                className={`toc-item ${isActive ? 'toc-item--active' : ''}`}
                onClick={() => scrollToSection(sec.slug)}
                aria-current={isActive ? 'location' : undefined}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {num ? `${num}. ${sec.title}` : sec.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
