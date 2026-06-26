import { useState } from 'react';

const CreateQuestionModal = ({ onClose, onCreated, createQuestion }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPoll, setHasPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const handleAddOption = () => {
    if (pollOptions.length >= 10) return;
    setPollOptions([...pollOptions, '']);
  };

  const handleRemoveOption = (idx) => {
    if (pollOptions.length <= 2) return;
    setPollOptions(pollOptions.filter((_, i) => i !== idx));
  };

  const handleOptionChange = (idx, value) => {
    const updated = [...pollOptions];
    updated[idx] = value;
    setPollOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (hasPoll) {
      if (!pollQuestion.trim()) {
        setError('Poll question is required');
        return;
      }
      const validOptions = pollOptions.filter((o) => o.trim());
      if (validOptions.length < 2) {
        setError('Poll must have at least 2 options');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const payload = { title: title.trim(), content: content.trim(), tags };

      if (hasPoll) {
        payload.poll = {
          question: pollQuestion.trim(),
          options: pollOptions.filter((o) => o.trim()).map((text) => ({ text: text.trim() })),
        };
      }

      await createQuestion(payload);
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 p-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
            💬 Ask a Question
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-2xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
              className="input-field w-full"
              maxLength={200}
            />
          </div>

          <div>
            <label className="label">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide details about your question..."
              className="input-field w-full min-h-[150px] resize-y"
              maxLength={5000}
            />
          </div>

          <div>
            <label className="label">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., react, javascript, career"
              className="input-field w-full"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Separate tags with commas</p>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPoll}
                onChange={(e) => setHasPoll(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Add a Poll</span>
            </label>
          </div>

          {hasPoll && (
            <div className="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <div>
                <label className="label">Poll Question</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="What's the poll about?"
                  className="input-field w-full"
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <label className="label">Options</label>
                {pollOptions.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="input-field flex-1 text-sm"
                      maxLength={200}
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 text-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  + Add option
                </button>
              )}
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Poll expires 10 days after posting. One vote per person.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestionModal;
