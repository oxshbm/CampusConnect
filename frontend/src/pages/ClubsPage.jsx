import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClubs } from '../hooks/useClubs';
import ClubCard from '../components/clubs/ClubCard';
import Spinner from '../components/common/Spinner';

const categories = ['All', 'Academic', 'Sports', 'Cultural', 'Technical', 'Arts', 'Other'];

export default function ClubsPage() {
  const { fetchApprovedClubs, loading } = useClubs();
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const loadClubs = async () => {
      const data = await fetchApprovedClubs();
      setClubs(data);
      applyFilters(data, searchQuery, categoryFilter);
    };
    loadClubs();
  }, []);

  const applyFilters = (clubList, search, category) => {
    let filtered = clubList;

    if (search) {
      filtered = filtered.filter((club) =>
        club.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter((club) => club.category === category);
    }

    setFilteredClubs(filtered);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(clubs, query, categoryFilter);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    applyFilters(clubs, searchQuery, category);
  };

  if (loading && clubs.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="py-6 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent mb-3">
              College Clubs
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Explore and join campus clubs
            </p>
          </div>
          <Link to="/clubs/register" className="btn-primary bg-gradient-to-r from-purple-600 to-purple-700">
            Register a Club
          </Link>
        </div>

        {/* Filters */}
        <div className="card p-4 md:p-8 mb-12 border-l-4 border-l-purple-600 dark:border-l-purple-500">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Search Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Input */}
            <div>
              <label className="label">Search Clubs</label>
              <input
                type="text"
                placeholder="Search by club name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="input-field w-full"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="label">Filter by Category</label>
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="input-field w-full"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <ClubCard key={club._id} club={club} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <div className="text-5xl mb-4">🏛️</div>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">
              {clubs.length === 0
                ? 'No clubs found'
                : 'No clubs match your search criteria'}
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 mt-2">
              {clubs.length === 0
                ? 'Be the first to register one!'
                : 'Try adjusting your filters'}
            </p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Showing <span className="font-bold text-purple-600 dark:text-purple-400">{filteredClubs.length}</span> of{' '}
          <span className="font-bold text-purple-600 dark:text-purple-400">{clubs.length}</span> clubs
        </div>
      </div>
    </div>
  );
}
