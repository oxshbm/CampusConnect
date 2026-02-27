import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card p-4 md:p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent text-center">
              Join Today
            </h1>
            <p className="text-center text-zinc-600 dark:text-zinc-400 mt-2">Create your CampusConnect account</p>
          </div>
          <SignupForm />
          <div className="border-t border-zinc-200 dark:border-zinc-700 mt-6 pt-6 space-y-4">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold">
                Login here
              </Link>
            </p>
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Are you an alumni?{' '}
              <Link to="/signup-alumni" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold">
                Register as Alumni
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
