import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateMe, getMe } from '../api/authApi';
import { Link } from 'react-router-dom';

const AVATARS = [
  '🦊', '🦁', '🐼', '🐨', '🐙', '🚀', '💻', '🎓', '🎨', '🔬', '⚽', '🎸', 
  '🐶', '🐱', '🦄', '🦖', '🍕', '☕', '🎮', '💡', '🌈', '🔥', '🌟', '🍀'
];

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    course: user?.course || '',
    year: user?.year || '',
    branch: user?.branch || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('groups');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        course: user.course || '',
        year: user.year || '',
        branch: user.branch || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await updateMe(
        formData.name,
        formData.course,
        parseInt(formData.year),
        formData.branch,
        formData.avatar
      );
      if (response.success) {
        setMessage('Profile updated successfully ✓');
        const freshUser = await getMe();
        if (freshUser.success) {
          setUser(freshUser.data);
        }
        setIsEditing(false);
      }
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const groupsCreated = user?.groupsCreated || [];
  const groupsJoined = user?.groupsJoined || [];
  const projects = user?.projects || [];
  const clubs = user?.clubs || [];
  const events = user?.events || [];

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-6 md:py-12 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
              👤 My Dashboard & Profile
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your academic profile, view joined/created study groups, projects, clubs and events.</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            message.includes('successfully')
              ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200'
          }`}>
            <span className="text-lg">{message.includes('successfully') ? '✓' : '⚠️'}</span>
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: PROFILE CARD */}
          <div className="lg:col-span-1 space-y-6">
            {!isEditing ? (
              <div className="card p-6 md:p-8 border-t-4 border-t-purple-600 dark:border-t-purple-500 space-y-6 shadow-md bg-white dark:bg-zinc-800">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.name}</h2>
                  <span className="inline-block mt-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider">
                    {user?.role === 'admin' ? '👑 Admin' : user?.role === 'alumni' ? '🎓 Alumni' : '👨‍🎓 Student'}
                  </span>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Email</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 break-all">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Course</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">{user?.course || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Branch</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">{user?.branch || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Year of Study</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {user?.year ? `${user.year}${user.year === 1 ? 'st' : user.year === 2 ? 'nd' : user.year === 3 ? 'rd' : 'th'} Year` : 'Not set'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary w-full flex justify-center items-center gap-2"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            ) : (
              <div className="card p-6 md:p-8 border-t-4 border-t-purple-600 dark:border-t-purple-500 shadow-md bg-white dark:bg-zinc-800">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">✏️ Update Profile</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label">Email Address (Read-only)</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="input-field bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed opacity-70"
                    />
                  </div>

                  <div>
                    <label className="label">Course (e.g. BCA, BTech, BBA)</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      placeholder="e.g. BTech, BCA, MBA"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label">Branch / Specialization</label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science, Finance"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label">Year of Study</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                      <option value="6">6th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Choose an Avatar</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-zinc-55 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: '' })}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-200 ${
                          !formData.avatar
                            ? 'bg-purple-600 border-purple-650 text-white shadow-md'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                        }`}
                      >
                        None
                      </button>
                      {AVATARS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatar: emoji })}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border transition-all duration-200 ${
                            formData.avatar === emoji
                              ? 'bg-purple-600 border-purple-600 text-white shadow-md scale-110'
                              : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? '🔄 Saving...' : '💾 Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: ACTIVITY & CONTRIBUTIONS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Groups</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                    {groupsJoined.length + groupsCreated.length}
                  </span>
                  <span className="text-xl">📚</span>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Projects</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                    {projects.length}
                  </span>
                  <span className="text-xl">💻</span>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Clubs</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                    {clubs.length}
                  </span>
                  <span className="text-xl">🏛️</span>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Events</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {events.length}
                  </span>
                  <span className="text-xl">📅</span>
                </div>
              </div>
            </div>

            {/* Tabs Bar */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-inner">
              <button
                onClick={() => setActiveTab('groups')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'groups'
                    ? 'bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                📚 Study Groups
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'projects'
                    ? 'bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                💻 Projects ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('clubs')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'clubs'
                    ? 'bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                🏛️ Clubs ({clubs.length})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'events'
                    ? 'bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                📅 Events ({events.length})
              </button>
            </div>

            {/* TAB PANELS */}
            <div className="space-y-6">
              {/* Groups Tab Content */}
              {activeTab === 'groups' && (
                <div className="space-y-6">
                  {/* Created Groups */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      👑 Created Groups ({groupsCreated.length})
                    </h3>
                    {groupsCreated.length === 0 ? (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        You haven't created any study groups yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {groupsCreated.map((group) => (
                          <Link
                            key={group._id || group.id}
                            to={`/group/${group._id || group.id}`}
                            className="block p-4 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all duration-200"
                          >
                            <h4 className="font-bold text-zinc-900 dark:text-white truncate">{group.name}</h4>
                            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">📚 {group.subject}</p>
                            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-4">
                              <span>👥 {group.members?.length || 0} members</span>
                              <span className="capitalize">{group.visibility}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Joined Groups */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      🤝 Joined Groups ({groupsJoined.length})
                    </h3>
                    {groupsJoined.length === 0 ? (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        You haven't joined any study groups yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {groupsJoined.map((group) => (
                          <Link
                            key={group._id || group.id}
                            to={`/group/${group._id || group.id}`}
                            className="block p-4 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all duration-200"
                          >
                            <h4 className="font-bold text-zinc-900 dark:text-white truncate">{group.name}</h4>
                            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">📚 {group.subject}</p>
                            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-4">
                              <span>👥 {group.members?.length || 0} members</span>
                              <span className="capitalize">{group.visibility}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Projects Tab Content */}
              {activeTab === 'projects' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">💻 Project Partner Teams</h3>
                  {projects.length === 0 ? (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      You are not part of any project partner teams yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((project) => (
                        <Link
                          key={project._id || project.id}
                          to={`/projects/${project._id || project.id}`}
                          className="block p-4 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-zinc-900 dark:text-white truncate">{project.title}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${
                              project.status === 'open'
                                ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          {project.techStack && project.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.techStack.slice(0, 3).map((tech) => (
                                <span key={tech} className="bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                  {tech}
                                </span>
                              ))}
                              {project.techStack.length > 3 && (
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 self-center">+{project.techStack.length - 3} more</span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mt-4">
                            <span>👥 {project.members?.length || 0} / {project.maxMembers || 4} members</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Clubs Tab Content */}
              {activeTab === 'clubs' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">🏛️ Clubs Joined</h3>
                  {clubs.length === 0 ? (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      You haven't joined any clubs yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {clubs.map((club) => (
                        <Link
                          key={club._id || club.id}
                          to={`/clubs/${club._id || club.id}`}
                          className="block p-4 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-zinc-900 dark:text-white truncate">{club.name}</h4>
                            <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {club.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">{club.description}</p>
                          <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mt-4">
                            <span>👥 {club.members?.length || 0} members</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Events Tab Content */}
              {activeTab === 'events' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">📅 RSVP'd Events</h3>
                  {events.length === 0 ? (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      You haven't RSVP'd to any events yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {events.map((event) => (
                        <Link
                          key={event._id || event.id}
                          to="/events"
                          className="block p-4 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-zinc-900 dark:text-white truncate">{event.title}</h4>
                            <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {event.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">{event.description}</p>
                          <div className="flex flex-col text-xs text-zinc-500 dark:text-zinc-400 mt-4 gap-1">
                            <span>📅 {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {event.time}</span>
                            <span className="capitalize">📍 {event.locationType} {event.locationDetail && `(${event.locationDetail})`}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
