import { useState } from 'react';
import { sendConnectionRequest } from '../../api/connectionApi';

const AlumniCard = ({ alumni, sentConnections = [], onConnectionSent }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getStatusColor = (status) => {
    const colors = {
      employed: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'self-employed': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      masters: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      phd: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
      other: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200',
    };
    return colors[status] || colors.other;
  };

  const getStatusLabel = (status) => {
    const labels = {
      employed: 'Employed',
      'self-employed': 'Self-Employed',
      masters: 'Pursuing Masters',
      phd: 'Pursuing PhD',
      other: 'Other',
    };
    return labels[status] || status;
  };

  const connectionStatus = sentConnections.find(c => c.alumni._id === alumni._id);

  const handleSendRequest = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await sendConnectionRequest(alumni._id, message);
      if (response.success) {
        setShowMessage(false);
        setMessage('');
        onConnectionSent && onConnectionSent();
      } else {
        setError(response.message || 'Failed to send connection request');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send connection request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Header with Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {alumni.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{alumni.name}</h3>
          {alumni.passingYear && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Class of {alumni.passingYear}</p>
          )}
        </div>
      </div>

      {/* Status Badge */}
      {alumni.currentStatus && (
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(alumni.currentStatus)}`}>
            {getStatusLabel(alumni.currentStatus)}
          </span>
        </div>
      )}

      {/* Job & Company Info */}
      <div className="mb-4 space-y-1">
        {alumni.currentCompany && (
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            💼 {alumni.currentCompany}
          </p>
        )}
        {alumni.jobTitle && (
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{alumni.jobTitle}</p>
        )}
        {alumni.location && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">📍 {alumni.location}</p>
        )}
      </div>

      {/* Bio */}
      {alumni.bio && (
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-2">
          {alumni.bio}
        </p>
      )}

      {/* LinkedIn Link */}
      {alumni.linkedIn && (
        <a
          href={alumni.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline mb-4"
        >
          🔗 View LinkedIn Profile
        </a>
      )}

      {/* Connection Status / Button */}
      <div className="mt-auto">
        {connectionStatus ? (
          <div
            className={`px-4 py-2 text-center rounded-lg font-semibold text-sm ${
              connectionStatus.status === 'pending'
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                : connectionStatus.status === 'accepted'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}
          >
            {connectionStatus.status === 'pending' ? '⏳ Pending' : connectionStatus.status === 'accepted' ? '✓ Connected' : '✗ Rejected'}
          </div>
        ) : (
          <>
            {showMessage ? (
              <div className="space-y-3">
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add an optional message (max 300 chars)..."
                  maxLength="300"
                  rows="3"
                  className="input-field resize-none text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSendRequest}
                    disabled={loading}
                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading ? 'Sending...' : 'Send Request'}
                  </button>
                  <button
                    onClick={() => {
                      setShowMessage(false);
                      setMessage('');
                      setError('');
                    }}
                    className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowMessage(true)}
                className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition-all"
              >
                Connect with Alumni
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlumniCard;
