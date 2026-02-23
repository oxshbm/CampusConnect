const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-800"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 absolute top-0 left-0"></div>
      </div>
      <p className="mt-6 text-zinc-600 dark:text-zinc-400 font-medium text-lg">Loading...</p>
    </div>
  );
};

export default Spinner;
