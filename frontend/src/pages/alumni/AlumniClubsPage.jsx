import { useEffect, useState } from 'react';
import { getApprovedClubs } from '../../api/clubApi';
import Spinner from '../../components/common/Spinner';

const AlumniClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await getApprovedClubs();
      if (response.success) {
        setClubs(response.data);
        applyFilters(response.data, '', 'all');
      } else {
        setError('Failed to fetch clubs');
      }
    } catch (err) {
      setError('Error fetching clubs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (clubList, search, category) => {
    let filtered = clubList;

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter((c) => c.category === category);
    }

    setFilteredClubs(filtered);
  };

  const handleSearch = (e) => {
    const newSearch = e.target.value;
    setSearchTerm(newSearch);
    applyFilters(clubs, newSearch, categoryFilter);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategoryFilter(newCategory);
    applyFilters(clubs, searchTerm, newCategory);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      Sports: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      Cultural: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      Technical: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      Arts: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
      Other: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200',
    };
    return colors[category] || colors.Other;
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent mb-2">
          College Clubs
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">Explore and learn about student clubs</p>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Filter Card */}
        <div className="card p-8 mb-12 border-l-4 border-l-blue-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Search Clubs</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name or description..."
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Filter by Category</label>
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="input-field"
              >
                <option value="all">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Technical">Technical</option>
                <option value="Arts">Arts</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredClubs.length === 0 ? (
            <div className="col-span-full card p-12 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">No clubs found</p>
            </div>
          ) : (
            filteredClubs.map((club) => (
              <div key={club._id} className="card p-6 hover:shadow-lg transition-shadow hover:scale-105">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(club.category)}`}>
                    {club.category}
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">👥 {club.members?.length || 0}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{club.name}</h3>

                <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-4 line-clamp-2">{club.description}</p>

                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  {club.foundedYear && <p>Founded: {club.foundedYear}</p>}
                  {club.contactEmail && <p>📧 {club.contactEmail}</p>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Showing {filteredClubs.length} of {clubs.length} clubs
        </div>
      </div>
    </div>
  );
};

export default AlumniClubsPage;
