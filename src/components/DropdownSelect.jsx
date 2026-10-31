import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function DropdownSelect({
  id,
  label,
  value,
  options,
  onChange,
  icon: Icon,
  placeholder,
  wrapperClassName = '',
  buttonClassName = '',
  menuClassName = '',
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const generatedId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;
  const triggerId = `${id}-${generatedId}`;
  const listId = `${triggerId}-options`;

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [open]);

  useEffect(() => {
    if (open && activeIndex >= 0) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const openMenu = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const selectOption = (option) => {
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(event.key === 'ArrowUp' ? options.length - 1 : selectedIndex >= 0 ? selectedIndex : 0);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleOptionKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === 'ArrowDown') nextIndex = Math.min(index + 1, options.length - 1);
    else if (event.key === 'ArrowUp') nextIndex = Math.max(index - 1, 0);
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = options.length - 1;
    else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    } else if (event.key === 'Tab') {
      setOpen(false);
      return;
    } else {
      return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div ref={rootRef} className={`relative w-full min-w-0 ${open ? 'z-50' : ''} ${wrapperClassName}`}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-label={`${label}${selectedOption ? `: ${selectedOption.label}` : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => open ? setOpen(false) : openMenu()}
        onKeyDown={handleTriggerKeyDown}
        className={`relative flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-line bg-white px-3 text-left text-sm text-ink shadow-sm hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${Icon ? 'pl-8' : ''} ${buttonClassName}`}
      >
        {Icon && <Icon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />}
        <span className="min-w-0 flex-1 truncate">{selectedOption?.label ?? placeholder ?? ''}</span>
        <ChevronDown className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
      </button>
      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label={label}
          className={`absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-0 max-w-full box-border overflow-y-auto rounded-lg border border-line bg-white p-1 shadow-lg ${menuClassName}`}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => { optionRefs.current[index] = element; }}
              type="button"
              role="option"
              aria-selected={option.value === value}
              title={option.label}
              onClick={() => selectOption(option)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              onFocus={() => setActiveIndex(index)}
              className={`block w-full min-w-0 truncate rounded-md px-3 py-2 text-left text-sm ${
                option.value === value ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
