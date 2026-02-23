import { useEffect, useRef, useState } from 'react';
import { usePaperReader } from '../context/PaperReaderContext';

const SECTION_LABELS: Record<string, string> = {
  introduction: 'I. Introduction',
  'related-work': 'II. Related Work',
  'model-methods': 'III. Model & Methods',
  results: 'V. Results',
  discussion: 'VI. Discussion',
  'limitations-future-work': 'VII. Limitations',
  conclusion: 'VIII. Conclusion',
  references: 'References',
};

export function Header() {
  const { currentSection, viewMode } = usePaperReader();
  const sectionLabel = SECTION_LABELS[currentSection] ?? '';
  const [visible, setVisible] = useState(true);
  const prevSection = useRef(currentSection);

  useEffect(() => {
    if (prevSection.current !== currentSection) {
      setVisible(false);
      const id = setTimeout(() => {
        prevSection.current = currentSection;
        setVisible(true);
      }, 150);
      return () => clearTimeout(id);
    }
  }, [currentSection]);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">
          Reputation-Weighted Prediction Markets
        </h1>
        <span className="header-meta">
          Emile Marcel Agustin &middot; Trece Research &middot; 2026
        </span>
      </div>
      {viewMode === 'markdown' && sectionLabel && (
        <span className={`header-section${visible ? '' : ' header-section--entering'}`}>
          {sectionLabel}
        </span>
      )}
    </header>
  );
}
