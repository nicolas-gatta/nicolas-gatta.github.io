import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './ProjectExplorer.module.css';

export default function TechnologyFilter({
  id,
  options,
  value,
  onChange,
}: {
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const query = value.trim().toLowerCase();
  const suggestions = options.filter((option) => option.toLowerCase().includes(query));
  const all = { label: 'All technologies', value: '' };
  const choices = suggestions.map((option) => ({ label: option, value: option }));
  if (query) choices.push(all);
  else choices.unshift(all);
  const active = activeIndex < choices.length ? activeIndex : -1;

  const show = () => {
    const bounds = input.current?.getBoundingClientRect();
    setAbove(!!bounds && window.innerHeight - bounds.bottom < 260 && bounds.top > 260);
    setOpen(true);
  };
  const choose = (next: string) => {
    onChange(next);
    setActiveIndex(-1);
    setOpen(false);
  };

  useEffect(() => {
    const container = list.current;
    const option = container?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!open || !container || !option) return;
    if (option.offsetTop < container.scrollTop) container.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > container.scrollTop + container.clientHeight) {
      container.scrollTop = option.offsetTop + option.offsetHeight - container.clientHeight;
    }
  }, [open, active]);

  return (
    <div
      className={styles.technologyPicker}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <div className={styles.pickerField}>
        <input
          ref={input}
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-activedescendant={open && active >= 0 ? `${id}-option-${active}` : undefined}
          value={value}
          placeholder="Search technologies"
          autoComplete="off"
          spellCheck={false}
          onFocus={show}
          onChange={(event) => {
            onChange(event.target.value);
            setActiveIndex(-1);
            show();
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              show();
              setActiveIndex((previous) => event.key === 'ArrowDown'
                ? (previous + 1) % choices.length
                : previous <= 0 ? choices.length - 1 : previous - 1);
            } else if (event.key === 'Enter' && open && active >= 0) {
              event.preventDefault();
              choose(choices[active].value);
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
        />
        <button
          type="button"
          className={styles.pickerToggle}
          aria-label={open ? 'Hide technologies' : 'Show technologies'}
          onClick={() => {
            const nextOpen = !open;
            input.current?.focus({ preventScroll: true });
            if (nextOpen) show();
            else setOpen(false);
            setActiveIndex(-1);
          }}
        >
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </div>
      {open && (
        <ul
          ref={list}
          id={`${id}-options`}
          className={styles.technologyOptions}
          role="listbox"
          aria-label="Technology suggestions"
          data-above={above}
        >
          {suggestions.length === 0 && <li role="presentation" className={styles.noSuggestion}>No technologies found.</li>}
          {choices.map((choice, index) => (
            <li
              key={choice.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={choice.value.toLowerCase() === query}
              data-index={index}
              data-active={index === active}
              onPointerDown={(event) => event.preventDefault()}
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => choose(choice.value)}
            >
              {choice.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
