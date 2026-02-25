export default function ClubMemberList({ members, isLeader, onRemove, currentUserId }) {
  return (
    <div className="card p-8 border-l-4 border-l-purple-600 dark:border-l-purple-500">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">👥 Club Members</h2>
        <span className="bg-purple-600 dark:bg-purple-700 text-white text-sm font-bold px-3 py-1 rounded-full">
          {members.length}
        </span>
      </div>
      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-zinc-50 dark:from-purple-900 dark:to-zinc-800 rounded-lg border border-purple-100 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md dark:hover:shadow-purple-900/50 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 rounded-full flex items-center justify-center text-white font-bold">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-zinc-900 dark:text-white">{member.name}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{member.email}</p>
              {member.course && (
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {member.course} • Year {member.year}
                </p>
              )}
            </div>
            {isLeader && member._id !== currentUserId && (
              <button
                onClick={() => onRemove(member._id)}
                className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
