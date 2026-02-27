import { useEffect, useState } from 'react';
import { getAlumni } from '../api/alumniApi';
import { getSentConnections } from '../api/connectionApi';
import AlumniCard from '../components/alumni/AlumniCard';
import Spinner from '../components/common/Spinner';

const AlumniConnectPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [sentConnections, setSentConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alumniRes, connectionsRes] = await Promise.all([
        getAlumni(),
        getSentConnections(),
      ]);

      if (alumniRes.success) {
        setAlumni(alumniRes.data);
        applyFilters(alumniRes.data, searchTerm, statusFilter, yearFilter);
      }

      if (connectionsRes.success) {
        setSentConnections(connectionsRes.data);
      }
    } catch (err) {
      setError('Error fetching alumni');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (alumniList, search, status, year) => {
    let filtered = alumniList;

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.currentCompany?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((a) => a.currentStatus === status);
    }

    if (year !== 'all') {
      filtered = filtered.filter((a) => a.passingYear === parseInt(year));
    }

    setFilteredAlumni(filtered);
  };

  const handleSearch = (e) => {
    const newSearch = e.target.value;
    setSearchTerm(newSearch);
    applyFilters(alumni, newSearch, statusFilter, yearFilter);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    applyFilters(alumni, searchTerm, newStatus, yearFilter);
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setYearFilter(newYear);
    applyFilters(alumni, searchTerm, statusFilter, newYear);
  };

  const getUniqueYears = () => {
    return Array.from(new Set(alumni.map(a => a.passingYear))).sort((a, b) => b - a);
  };

  const handleConnectionSent = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) return <Spinner />;

  const uniqueYears = getUniqueYears();

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-emerald-50 dark:from-zinc-950 dark:to-zinc-900 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent mb-2">
            Alumni Connect
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Connect with alumni and get insights from their experiences
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Filter Card */}
        <div className="card p-6 mb-12 border-l-4 border-l-emerald-600">
          <h2 className="text-lg font-bold mb-4">Filter Alumni</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="label">Search Name or Company</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search alumni..."
                className="input-field"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="label">Current Status</label>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="masters">Pursuing Masters</option>
                <option value="phd">Pursuing PhD</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="label">Passing Year</label>
              <select
                value={yearFilter}
                onChange={handleYearChange}
                className="input-field"
              >
                <option value="all">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    Class of {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        {filteredAlumni.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              {alumni.length === 0 ? 'No alumni registered yet' : 'No alumni match your filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredAlumni.map((alumnus) => (
              <AlumniCard
                key={alumnus._id}
                alumni={alumnus}
                sentConnections={sentConnections}
                onConnectionSent={handleConnectionSent}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Showing {filteredAlumni.length} of {alumni.length} alumni
        </div>
      </div>
    </div>
  );
};

export default AlumniConnectPage;
