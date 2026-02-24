import { useState } from 'react';

const TechStackInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div>
      <label className="label">Tech Stack</label>
      <div className="input-field flex flex-wrap gap-2 min-h-[48px] cursor-text p-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 font-bold hover:text-purple-900 dark:hover:text-purple-100"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? 'Add tech (Enter to add)...' : ''}
          className="outline-none bg-transparent flex-1 min-w-[120px] text-sm dark:text-white"
        />
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Press Enter or comma to add a technology</p>
    </div>
  );
};

export default TechStackInput;
