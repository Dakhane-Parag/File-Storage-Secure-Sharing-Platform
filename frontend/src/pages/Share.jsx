import { useParams } from "react-router-dom";

const Share = () => {
  const { token } = useParams();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center max-w-md w-full">
        <h1 className="text-xl font-semibold mb-2">Shared File</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Preparing your download
        </p>
        <div className="text-xs text-zinc-500 break-all mb-6">
          Token: {token}
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-md">
          Download File
        </button>
      </div>
    </div>
  );
};

export default Share;
