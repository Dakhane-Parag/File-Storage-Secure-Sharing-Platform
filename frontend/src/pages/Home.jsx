import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="w-full border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔐</span>
            <h1 className="text-lg font-semibold">FileVault</h1>
          </div>

          <div className="space-x-3">
            <Link
              to="/login"
              className="text-sm text-zinc-300 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-indigo-600/20 flex items-center justify-center text-2xl">
              📁
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold">
            FileVault — Secure File Storage & Sharing
          </h2>

          <p className="mt-4 text-zinc-400 text-base sm:text-lg">
            Upload files securely, manage access with ownership-based controls,
            and share files using time-bound, revocable links — all powered by a
            security-first backend.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="font-medium mb-1">Secure Uploads</h3>
              <p className="text-zinc-400">
                Files are safely stored with strict authentication checks.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="font-medium mb-1">Access Control</h3>
              <p className="text-zinc-400">
                Only file owners can view or download their data.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h3 className="font-medium mb-1">Shareable Links</h3>
              <p className="text-zinc-400">
                Generate expiring, revocable links for secure sharing.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-md font-medium transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto border border-zinc-700 hover:border-zinc-500 px-6 py-3 rounded-md text-zinc-300 hover:text-white transition"
            >
              Login
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-4 text-center text-sm text-zinc-500">
        FileVault • Built with a backend-first, security-focused architecture
      </footer>
    </div>
  );
};

export default Home;
