import { useState } from 'react';

const categories = ['Academic', 'Sports', 'Cultural', 'Technical', 'Arts', 'Other'];

export default function ClubForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    teamSize: initialData?.teamSize || '',
    category: initialData?.category || 'Academic',
    contactEmail: initialData?.contactEmail || '',
    foundedYear: initialData?.foundedYear || '',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError('Club name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setValidationError('Description is required');
      return false;
    }
    if (!formData.teamSize || formData.teamSize < 1) {
      setValidationError('Team size must be at least 1');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 rounded">
          {validationError}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="label">Club Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter club name"
          className="input-field w-full"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your club"
          maxLength={1000}
          rows="4"
          className="input-field w-full resize-none"
          required
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {formData.description.length}/1000
        </p>
      </div>

      {/* Team Size */}
      <div>
        <label className="label">Team Size</label>
        <input
          type="number"
          name="teamSize"
          value={formData.teamSize}
          onChange={handleChange}
          placeholder="Expected number of members"
          min="1"
          className="input-field w-full"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input-field w-full"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Contact Email */}
      <div>
        <label className="label">Contact Email (Optional)</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          placeholder="contact@example.com"
          className="input-field w-full"
        />
      </div>

      {/* Founded Year */}
      <div>
        <label className="label">Founded Year (Optional)</label>
        <input
          type="number"
          name="foundedYear"
          value={formData.foundedYear}
          onChange={handleChange}
          placeholder="2024"
          min="1900"
          max={new Date().getFullYear()}
          className="input-field w-full"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Register Club'}
      </button>
    </form>
  );
}
