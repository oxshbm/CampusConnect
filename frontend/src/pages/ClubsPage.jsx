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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">🏛️ College Clubs</h1>
        <Link to="/clubs/register" className="btn-primary">
          Register a Club
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="card p-4 md:p-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            {clubs.length === 0
              ? 'No clubs found. Be the first to register one!'
              : 'No clubs match your search criteria.'}
          </p>
        </div>
      )}

      {/* Footer Stats */}
      <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Showing {filteredClubs.length} of {clubs.length} clubs
      </div>
    </div>
  );
}
