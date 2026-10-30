import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ChevronRight,
  Command,
  Terminal as TerminalIcon,
  X,
} from 'lucide-react';
import {
  commandNames,
  executeCommand,
  type CommandResponse,
  type TerminalAction,
} from './commands';
import styles from './Terminal.module.css';

interface TerminalProps {
  onClose: () => void;
  onAction: (action: TerminalAction) => void;
}
interface Entry extends CommandResponse {
  id: number;
  command?: string;
}

export default function Terminal({ onClose, onAction }: TerminalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const id = useRef(1);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: 0,
      lines: [
        'Connection established.',
        'NICO OS — an intentionally small operating system.',
        'Type “help” to explore. Nothing here runs on your device.',
      ],
    },
  ]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const element = dialog.current;
    document.body.style.overflow = 'hidden';
    element?.showModal();
    inputRef.current?.focus({ preventScroll: true });
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [entries]);

  function run(raw: string) {
    if (!raw.trim()) return;
    const command = raw.trim().slice(0, 160);
    const response = executeCommand(command);
    setHistory((current) => [command, ...current].slice(0, 50));
    setHistoryIndex(-1);
    setInput('');
    if (response.action === 'clear') setEntries([]);
    else
      setEntries((current) => [
        ...current.slice(-49),
        { id: id.current++, command, ...response },
      ]);
    if (response.action) onAction(response.action);
  }

  return (
    <dialog
      ref={dialog}
      className={styles.terminal}
      aria-labelledby="terminal-title"
      aria-describedby="terminal-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.target === event.currentTarget &&
          (event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom)
        )
          onClose();
      }}
    >
      <header className={styles.header}>
        <div className={styles.title}>
          <TerminalIcon size={16} />
          <h2 id="terminal-title">
            NICO OS <span>/ TERMINAL</span>
          </h2>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.connected}>LOCAL SESSION</span>
          <button onClick={onClose} aria-label="Close terminal">
            <X size={18} />
          </button>
        </div>
      </header>
      <div className={styles.description} id="terminal-description">
        <span className={styles.dot} /> A little curiosity goes a long way.
        <kbd>ESC to close</kbd>
      </div>
      <div
        className={styles.output}
        role="log"
        aria-label="Terminal output"
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={0}
      >
        {entries.map((entry) => (
          <div key={entry.id} className={styles.entry}>
            {entry.command && (
              <div className={styles.prompt}>
                <span>nicolas@portfolio</span>
                <ChevronRight size={12} />
                <span>{entry.command}</span>
              </div>
            )}
            <pre className={entry.kind ? styles[entry.kind] : undefined}>
              {entry.lines.join('\n')}
            </pre>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <form
        className={styles.inputRow}
        onSubmit={(event) => {
          event.preventDefault();
          run(input);
        }}
      >
        <label htmlFor="terminal-command">
          <ChevronRight size={17} />
          <span className={styles.visuallyHidden}>Terminal command</span>
        </label>
        <input
          id="terminal-command"
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={160}
          placeholder="Type a command…"
          aria-describedby="terminal-hint"
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
              event.preventDefault();
              const next =
                event.key === 'ArrowUp'
                  ? Math.min(historyIndex + 1, history.length - 1)
                  : Math.max(historyIndex - 1, -1);
              setHistoryIndex(next);
              setInput(next >= 0 ? history[next] : '');
            }
            if (event.key === 'Tab' && input.trim()) {
              const matches = commandNames.filter((command) =>
                command.startsWith(input.trim().toLowerCase())
              );
              if (matches.length === 1) {
                event.preventDefault();
                setInput(matches[0]);
              }
            }
            if (event.key.toLowerCase() === 'l' && event.ctrlKey) {
              event.preventDefault();
              setEntries([]);
            }
          }}
        />
        <button
          type="submit"
          aria-label="Run terminal command"
          disabled={!input.trim()}
        >
          <ArrowUpRight size={18} />
        </button>
      </form>
      <footer className={styles.footer}>
        <span id="terminal-hint">
          Type <button onClick={() => run('help')}>help</button> for commands
        </span>
        <span>
          <Command size={10} /> Curiosity welcome
        </span>
      </footer>
    </dialog>
  );
}
