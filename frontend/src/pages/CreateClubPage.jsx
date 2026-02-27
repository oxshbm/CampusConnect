import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubs } from '../hooks/useClubs';
import ClubForm from '../components/clubs/ClubForm';

export default function CreateClubPage() {
  const navigate = useNavigate();
  const { createNewClub, loading, error } = useClubs();
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (formData) => {
    try {
      await createNewClub(formData);
      setSuccessMessage('✅ Club registered successfully! Pending admin approval.');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/clubs');
      }, 2000);
    } catch (error) {
      console.error('Failed to create club:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          Register Your Club
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Create a profile for your college club and start connecting with members.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded p-4 text-blue-800 dark:text-blue-200">
        <p className="text-sm">
          ℹ️ Your club registration is pending admin approval and will appear publicly once approved.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded p-4 text-green-800 dark:text-green-200">
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-4 text-red-800 dark:text-red-200">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="card p-4 md:p-8">
        <ClubForm initialData={null} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
