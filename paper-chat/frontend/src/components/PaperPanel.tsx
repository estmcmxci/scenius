import { useCallback, useEffect, useRef, useState } from 'react';
import { usePaperReader } from '../context/PaperReaderContext';
import { useIntersectionTracker } from '../hooks/useIntersectionTracker';
import { PaperSectionRenderer } from './PaperSection';
import { TableOfContents } from './TableOfContents';
import { SelectionTooltip } from './SelectionTooltip';
import { PdfViewer } from './PdfViewer';
import type { PaperData } from '../types/paper';

export function PaperPanel() {
  const [paper, setPaper] = useState<PaperData | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { viewMode, setViewMode, setCurrentSection, registerPaperScroll } = usePaperReader();

  // Fetch paper data
  useEffect(() => {
    fetch('/api/paper/full')
      .then((res) => res.json())
      .then((data: PaperData) => setPaper(data))
      .catch(console.error);
  }, []);

  // Reading progress bar
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const progress = scrollHeight <= clientHeight ? 0 : scrollTop / (scrollHeight - clientHeight);
      setReadingProgress(Math.min(1, Math.max(0, progress)));
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [paper]);

  // Section tracking via IntersectionObserver
  useIntersectionTracker(setCurrentSection, scrollRef);

  // Register scroll-to-section function for context
  const scrollToSection = useCallback((slug: string) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.querySelector(`[data-section="${slug}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    registerPaperScroll(scrollToSection);
  }, [registerPaperScroll, scrollToSection]);

  if (!paper) {
    return (
      <div className="paper-panel">
        <div className="paper-loading">
          <div className="skeleton-block skeleton-block--title" />
          <div className="skeleton-block skeleton-block--wide" />
          <div className="skeleton-block skeleton-block--medium" />
          <div className="skeleton-block skeleton-block--wide" />
          <div className="skeleton-block skeleton-block--narrow" />
          <div className="skeleton-block skeleton-block--short" />
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(readingProgress * 100);

  return (
    <div className="paper-panel">
      {/* Progress bar */}
      {viewMode === 'markdown' && (
        <div className="reading-progress-track">
          <div
            className="reading-progress-bar"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Panel header */}
      <div className="paper-panel-header">
        <h2 className="paper-panel-title">{paper.title}</h2>
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'markdown' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => setViewMode('markdown')}
          >
            Reading View
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'pdf' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => setViewMode('pdf')}
          >
            PDF
          </button>
        </div>
      </div>

      {viewMode === 'markdown' ? (
        <div className="paper-body">
          <TableOfContents sections={paper.sections} />
          <div className="paper-scroll" ref={scrollRef}>
            <div className="paper-content">
              {paper.sections.map((sec) => (
                <PaperSectionRenderer key={sec.slug} section={sec} />
              ))}
            </div>
            <SelectionTooltip containerRef={scrollRef} />
          </div>
        </div>
      ) : (
        <div className="paper-body paper-body--pdf">
          <PdfViewer />
        </div>
      )}
    </div>
  );
}
