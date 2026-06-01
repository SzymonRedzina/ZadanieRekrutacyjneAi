import React, { useState, KeyboardEvent } from 'react';
import './app.css';

interface AutocompleteProps<T> {
  options: T[];
  selected: T[];
  onSelect: (item: T) => void;
  onRemove: (item: T) => void;
  onCreate?: (value: string) => void;
  getLabel: (item: T) => string;
  placeholder?: string;
}

export function Autocomplete<T>({
  options, selected, onSelect, onRemove, onCreate, getLabel, placeholder
}: AutocompleteProps<T>) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = options.filter(o => 
    getLabel(o).toLowerCase().includes(query.toLowerCase()) && 
    !selected.some(s => getLabel(s) === getLabel(o))
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') setActiveIndex(p => Math.min(p + 1, filtered.length - 1));
    else if (e.key === 'ArrowUp') setActiveIndex(p => Math.max(p - 1, 0));
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) onSelect(filtered[activeIndex]);
      else if (query && onCreate) onCreate(query);
      setQuery(''); setActiveIndex(-1);
    }
  };

  return (
    <div className="autocomplete-wrapper">
      <div className="tags-container">
        {selected.map((item, i) => (
          <span key={i} className="tag">
            {getLabel(item)}
            <button className="remove-btn" onClick={() => onRemove(item)}>&times;</button>
          </span>
        ))}
      </div>
      <input
        className="autocomplete-input"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {isOpen && (
        <ul className="dropdown-list">
          {filtered.map((opt, idx) => (
            <li 
              key={idx} 
              className={`dropdown-item ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => { onSelect(opt); setQuery(''); setIsOpen(false); }}
            >
              {getLabel(opt)}
            </li>
          ))}
          {query && !filtered.length && onCreate && (
            <li className="dropdown-item" onClick={() => { onCreate(query); setQuery(''); setIsOpen(false); }}>
              Dodaj: "{query}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}