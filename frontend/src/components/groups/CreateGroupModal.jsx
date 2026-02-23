import { useState } from 'react';
import { useGroups } from '../../hooks/useGroups';
import GroupForm from './GroupForm';

const CreateGroupModal = ({ onClose, onCreated }) => {
  const { createNewGroup, loading } = useGroups();
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setError('');
      await createNewGroup(
        formData.name,
        formData.subject,
        formData.description,
        formData.semester,
        formData.tags,
        formData.visibility,
        formData.maxMembers,
        formData.meetingType,
        formData.location,
        formData.scheduleDays,
        formData.startTime,
        formData.duration
      );

      if (onCreated) {
        onCreated();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create group');
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 p-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
            ✨ Create New Study Group
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-2xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <GroupForm
            initialData={{}}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
