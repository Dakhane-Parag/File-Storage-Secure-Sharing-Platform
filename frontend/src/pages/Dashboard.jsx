import { useState } from "react";

const Dashboard = () => {
  const [files] = useState([
    { id: 1, name: "resume.pdf", type: "PDF", size: "240 KB" },
    { id: 2, name: "notes.txt", type: "TXT", size: "12 KB" },
  ]);

  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col md:flex-row">

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
        <h1 className="text-sm font-semibold">FileVault</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 px-3 py-1.5 rounded-md text-sm"
        >
          + New
        </button>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 hidden md:flex flex-col">
        <h1 className="text-lg font-semibold mb-6">Welcome to FileVault</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 rounded-md py-2 text-sm mb-6"
        >
          + New
        </button>
        <nav className="space-y-3 text-sm text-zinc-400">
          <div className="text-white">My Files</div>
          <div className="hover:text-white cursor-pointer">Shared</div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full p-4 sm:p-6 overflow-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-4 text-xs text-zinc-400 px-4 py-3 border-b border-zinc-800">
                <span>Name</span>
                <span>Type</span>
                <span>Size</span>
                <span className="text-right">Actions</span>
              </div>

              {files.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-4 px-4 py-3 text-sm border-b border-zinc-800 items-center"
                >
                  <span className="truncate">{file.name}</span>
                  <span className="text-zinc-400">{file.type}</span>
                  <span className="text-zinc-400">{file.size}</span>
                  <div className="flex justify-end gap-4">
                    <button className="text-indigo-400 hover:underline">
                      Download
                    </button>
                    <button className="text-emerald-400 hover:underline">
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Floating Upload Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xl flex items-center justify-center shadow-lg z-40"
      >
        +
      </button>

      {/* Upload Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-5">
            <h2 className="text-lg font-semibold mb-4">Upload file</h2>

            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-indigo-500 transition">
              <input type="file" className="hidden" id="upload" />
              <label htmlFor="upload" className="cursor-pointer space-y-2 block">
                <div className="mx-auto h-12 w-12 bg-zinc-800 rounded-full flex items-center justify-center text-indigo-400">
                  ⬆
                </div>
                <p className="text-sm">Click to upload or drag & drop</p>
                <p className="text-xs text-zinc-500">
                  PDF, PNG, JPG, TXT (max 5MB)
                </p>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-md">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
