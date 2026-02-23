import { usePaperReader } from '../context/PaperReaderContext';
import { getPromptsForSection } from '../lib/contextual-prompts';

interface Props {
  onSendMessage: (message: string) => void;
}

export function SuggestedPrompts({ onSendMessage }: Props) {
  const { currentSection } = usePaperReader();
  const prompts = getPromptsForSection(currentSection);

  return (
    <div className="suggested-prompts" key={currentSection}>
      {prompts.map((p, index) => (
        <button
          key={p.label}
          className="suggested-prompt-chip"
          onClick={() => onSendMessage(p.prompt)}
          style={{ animationDelay: `${index * 60}ms` }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
