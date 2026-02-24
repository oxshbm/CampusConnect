import { useState } from 'react';
import TechStackInput from './TechStackInput';

const ProjectForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    techStack: initialData?.techStack || [],
    maxMembers: initialData?.maxMembers || '5',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
    status: initialData?.status || 'open',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTechStackChange = (newTechStack) => {
    setFormData({
      ...formData,
      techStack: newTechStack,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    if (formData.techStack.length === 0) {
      setError('Please add at least one technology');
      return;
    }

    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadlineDate <= today) {
      setError('Deadline must be in the future');
      return;
    }

    onSubmit({
      ...formData,
      maxMembers: parseInt(formData.maxMembers),
    });
  };

  const isEditing = !!initialData?._id;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="label">📋 Project Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., AI-Powered Task Manager"
          required
          className="input-field"
        />
      </div>

      <div>
        <label className="label">📖 Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength="500"
          placeholder="Describe your project, goals, and what you're looking for in team members..."
          className="input-field resize-none"
          rows="4"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {formData.description.length}/500 characters
        </p>
      </div>

      <TechStackInput value={formData.techStack} onChange={handleTechStackChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">👥 Max Team Members</label>
          <input
            type="number"
            name="maxMembers"
            value={formData.maxMembers}
            onChange={handleChange}
            min="1"
            max="50"
            className="input-field"
          />
        </div>

        <div>
          <label className="label">📅 Project Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
      </div>

      {isEditing && (
        <div>
          <label className="label">📊 Project Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="open">🟢 Open (Accepting Applications)</option>
            <option value="in_progress">🟡 In Progress (Active)</option>
            <option value="completed">⚫ Completed</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading
          ? '🔄 Processing...'
          : isEditing
          ? '💾 Save Changes'
          : '✨ Create Project'}
      </button>
    </form>
  );
};

export default ProjectForm;
