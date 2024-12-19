import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ label, value, onChange, suggestions }) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if (!suggestions.includes(inputValue)) {
          setError(true);
          setInputValue(value); // Reset to the last valid value
        } else {
          onChange(inputValue);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputValue, onChange, suggestions, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);
    setError(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    setError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length === 1) {
        handleSuggestionClick(filteredSuggestions[0] ?? "");
      } else if (!suggestions.includes(inputValue)) {
        setError(true);
      }
    }
  };

  const handleInputBlur = () => {
    if (!suggestions.includes(inputValue)) {
      setError(true);
      setInputValue(''); // Clear invalid input
      onChange(''); // Inform parent component of empty value
    } else {
      onChange(inputValue);
    }
  };
  const filteredSuggestions = suggestions.filter(suggestion => {
    return suggestion.toLowerCase().includes(inputValue.toLowerCase())
  }
  );
  return (
    <div className="mb-4 relative" ref={inputRef}>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
        {label}
      </label>
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          error ? 'border-red-500' : ''
        }`}
        id={label}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        aria-autocomplete="list"
        aria-controls={`${label}-suggestions`}
        aria-expanded={showSuggestions}
        autoComplete='off'
      />
      {error && inputValue !== '' && (
        <p className="text-red-500 text-xs italic mt-1">Please select a valid option from the suggestions.</p>
      )}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          id={`${label}-suggestions`}
          className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto"
          role="listbox"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;

