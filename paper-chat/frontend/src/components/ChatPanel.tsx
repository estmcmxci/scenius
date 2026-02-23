import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { paperTheme } from '../lib/theme';
import { usePaperReader } from '../context/PaperReaderContext';
import { SuggestedPrompts } from './SuggestedPrompts';

// --- 8-bit hourglass pixel data (16x20, grayscale) ---
// 0=transparent, 1=#333, 2=#777, 3=#aaa, 4=#ddd
const HG: number[][] = [
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,4,4,4,4,4,4,4,4,4,4,1,0,0],
  [0,0,1,3,3,3,3,3,3,3,3,3,3,1,0,0],
  [0,0,0,1,4,4,4,4,4,4,4,4,1,0,0,0],
  [0,0,0,1,3,4,4,4,4,4,4,3,1,0,0,0],
  [0,0,0,0,1,3,4,4,4,4,3,1,0,0,0,0],
  [0,0,0,0,1,3,3,4,4,3,3,1,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,3,3,2,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,3,3,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,0,1,3,3,4,4,3,3,1,0,0,0,0],
  [0,0,0,0,1,3,4,4,4,4,3,1,0,0,0,0],
  [0,0,0,1,3,4,4,4,4,4,4,3,1,0,0,0],
  [0,0,0,1,4,4,4,4,4,4,4,4,1,0,0,0],
  [0,0,1,3,3,3,3,3,3,3,3,3,3,1,0,0],
  [0,0,1,4,4,4,4,4,4,4,4,4,4,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
];
const PAL: Record<number, string> = { 1: '#333', 2: '#777', 3: '#aaa', 4: '#ddd' };

const PHASES = [
  { text: 'Reading your question', at: 0 },
  { text: 'Searching the paper', at: 2 },
  { text: 'Analyzing sections', at: 5 },
  { text: 'Reasoning', at: 10 },
  { text: 'Synthesizing', at: 18 },
  { text: 'Deep thinking', at: 30 },
];

function drawHourglass(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, 16, 20);
  for (let y = 0; y < HG.length; y++) {
    const row = HG[y];
    if (!row) continue;
    for (let x = 0; x < row.length; x++) {
      const c = row[x];
      if (!c) continue;
      ctx.fillStyle = PAL[c] || '#fff';
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// ─── Thinking overlay component ───

function ThinkingIndicator({ startTime }: { startTime: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState(PHASES[0]!.text);
  const [dots, setDots] = useState('.');

  useEffect(() => {
    if (canvasRef.current) drawHourglass(canvasRef.current);
  }, []);

  useEffect(() => {
    const tick = () => {
      const secs = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(secs);
      setDots('.'.repeat((secs % 3) + 1));
      let current = PHASES[0]!.text;
      for (const p of PHASES) { if (secs >= p.at) current = p.text; }
      setPhase(current);
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [startTime]);

  return (
    <div style={{
      position: 'absolute',
      left: 24,
      bottom: 80,
      zIndex: 10,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 14px',
      borderRadius: 8,
      background: '#1a1a1f',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: 13,
      color: '#999',
      pointerEvents: 'none',
      animation: 'hg-fade 2.5s ease-in-out infinite',
    }}>
      <div style={{ animation: 'hg-spin 2s ease-in-out infinite', lineHeight: 0, flexShrink: 0 }}>
        <canvas
          ref={canvasRef}
          width={16}
          height={20}
          style={{ width: 20, height: 25, imageRendering: 'pixelated' as never }}
        />
      </div>
      <span>
        {phase}<span style={{ display: 'inline-block', width: 18, textAlign: 'left' }}>{dots}</span>
      </span>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 11, opacity: 0.4, marginLeft: 4 }}>
        {elapsed}s
      </span>
    </div>
  );
}

// ─── Main component ───

export function ChatPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const thinkingStartRef = useRef(0);
  const { registerChatMethods } = usePaperReader();

  const chatKit = useChatKit({
    api: {
      url: (import.meta as unknown as { env: Record<string, string> }).env.VITE_CHATKIT_URL || '/chatkit',
      domainKey: 'paper-chat',
    },
    theme: paperTheme,
    startScreen: {
      greeting: 'Ask me anything about the paper.',
      prompts: [
        { label: 'Summarize the paper', prompt: 'What is the main finding of this paper?' },
        { label: 'Explain mechanisms', prompt: 'Explain the three aggregation mechanisms (E, C, R) and how they differ.' },
        { label: 'Show results', prompt: 'Show me the main results for Regime B (anti-correlated).' },
        { label: 'Run a simulation', prompt: 'Run a simulation with alpha=1.3 and sigma_s=1.5 in Regime B.' },
        { label: 'Generate a figure', prompt: 'Generate a calibration plot for Regime B.' },
      ],
    },
    header: { enabled: false },
    composer: { placeholder: 'Ask about the paper, simulations, or data...' },
    onResponseStart: () => {
      thinkingStartRef.current = Date.now();
      setIsThinking(true);
    },
    onResponseEnd: () => {
      setIsThinking(false);
    },
  });

  // Wrap ChatKit object-param methods into simple string callbacks for the context
  const setComposerText = useCallback(
    (value: string) => chatKit.setComposerValue({ text: value }),
    [chatKit],
  );
  const sendMessage = useCallback(
    (message: string) => { chatKit.sendUserMessage({ text: message }); },
    [chatKit],
  );

  // Register chat methods with context so paper panel can use them
  useEffect(() => {
    registerChatMethods({
      setComposerValue: setComposerText,
      focusComposer: chatKit.focusComposer,
      sendUserMessage: sendMessage,
    });
  }, [registerChatMethods, setComposerText, chatKit.focusComposer, sendMessage]);

  return (
    <div ref={containerRef} className="chat-panel">
      <ChatKit control={chatKit.control} style={{ flex: 1, minHeight: 0 }} />
      {isThinking && <ThinkingIndicator startTime={thinkingStartRef.current} />}
      <SuggestedPrompts onSendMessage={sendMessage} />
    </div>
  );
}
