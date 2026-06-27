const toId = (value) => value?._id || value?.id || value;
const sameId = (a, b) => toId(a)?.toString() === toId(b)?.toString();

const MemberList = ({ members, onKick, ownerId }) => {
  return (
    <div className="card p-4 md:p-8 border-l-4 border-l-purple-600 dark:border-l-purple-500">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">👥 Group Members</h2>
        <span className="bg-purple-600 dark:bg-purple-700 text-white text-sm font-bold px-3 py-1 rounded-full">
          {members.length}
        </span>
      </div>
      <div className="space-y-3">
        {members.length === 0 && (
          <p className="text-zinc-600 dark:text-zinc-400">No members yet.</p>
        )}
        {members.map((member) => {
          const isOwner = sameId(member, ownerId);
          return (
            <div
              key={member._id}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-zinc-50 dark:from-purple-900 dark:to-zinc-800 rounded-lg border border-purple-100 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md dark:hover:shadow-purple-900/50 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {member.avatar ? member.avatar : member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-zinc-900 dark:text-white truncate">{member.name}</p>
                  {isOwner && (
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                      👑 Owner
                    </span>
                  )}
                </div>
                {member.email && <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{member.email}</p>}
                {member.course && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                    {member.course} • Year {member.year}
                  </p>
                )}
              </div>
              {onKick && !isOwner && (
                <button
                  onClick={() => onKick(member._id || member.id)}
                  className="btn-primary py-1 px-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-xs font-semibold rounded-lg self-center"
                >
                  Kick
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberList;
