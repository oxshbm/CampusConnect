import { Link } from 'react-router-dom';

const getCategoryColor = (category) => {
  const colors = {
    Academic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    Cultural: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Technical: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Arts: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    Other: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200',
  };
  return colors[category] || colors.Other;
};

export default function ClubCard({ club }) {
  return (
    <Link
      to={`/clubs/${club._id}`}
      className="card hover:shadow-lg hover:scale-105 transition-transform duration-200 overflow-hidden h-full"
    >
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(club.category)}`}>
            {club.category}
          </span>
        </div>

        {/* Club Name */}
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 line-clamp-2">
          {club.name}
        </h3>

        {/* Description */}
        <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-4 line-clamp-2">
          {club.description}
        </p>

        {/* Footer Stats */}
        <div className="flex justify-between items-center text-sm text-zinc-600 dark:text-zinc-400">
          <span>👥 {club.members?.length || 0} members</span>
          <span>🎯 {club.teamSize} size</span>
        </div>
      </div>
    </Link>
  );
}
