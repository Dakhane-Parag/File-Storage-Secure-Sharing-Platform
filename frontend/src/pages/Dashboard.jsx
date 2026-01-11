import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios.js";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [activeView, setActiveView] = useState("files"); 

  const fetchSharedLinks = async () => {
    try {
      const res = await api.get("/api/share/mysharedlinks");
      setSharedLinks(res.data.shareLinks || []);
    } catch (error) {
      console.error("Failed to fetch shared links", error);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await api.get("/api/files");
      setFiles(Array.isArray(res.data) ? res.data : res.data.files || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchSharedLinks();
  }, []);

  const uploadFiles = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await api.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOpen(false);
      setSelectedFile(null);
      setLoading(true);
      fetchFiles();
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await api.get(`/api/files/${fileId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleShare = async (fileId) => {
    try {
      const res = await api.post(`/api/share/${fileId}`);
      const expiresAt = res.data?.expiresAt;
      const shareUrl = res.data?.shareUrl;

      if (!shareUrl) {
        throw new Error("Share token not received from server");
      }

      const fullUrl = `${window.location.origin}${shareUrl}`;
      await navigator.clipboard.writeText(fullUrl);

      toast.success(
        `Share link copied! Expires on ${new Date(expiresAt).toLocaleString()}`,
        { duration: 4000 }
      );

      fetchSharedLinks();
    } catch (error) {
      console.error("Failed to create share link", error);
      toast.error("Failed to create share link. Please try again.");
    }
  };

  const handleRevoke = async (token) => {
  try {
    await api.patch(`/api/share/${token}/revoke`);

    toast.success("Share link revoked");

    setSharedLinks((prev) =>
      prev.map((link) =>
        link.token === token
          ? { ...link, isActive: false }
          : link
      )
    );
  } catch (error) {
    console.error("Failed to revoke share link", error);
    toast.error("Failed to revoke share link");
  }
};


  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
        <h1 className="text-sm font-semibold">FileVault</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 px-3 py-1.5 rounded-md text-sm"
          >
            + New
          </button>
          <button
            onClick={logout}
            className="border border-zinc-700 px-3 py-1.5 rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Mobile View Switcher */}
<div className="md:hidden flex border-b border-zinc-800 bg-zinc-900">
  <button
    onClick={() => setActiveView("files")}
    className={`flex-1 py-2 text-sm text-center ${
      activeView === "files"
        ? "text-white border-b-2 border-indigo-500"
        : "text-zinc-400"
    }`}
  >
    All My Files
  </button>

  <button
    onClick={() => setActiveView("shared")}
    className={`flex-1 py-2 text-sm text-center ${
      activeView === "shared"
        ? "text-white border-b-2 border-indigo-500"
        : "text-zinc-400"
    }`}
  >
    Shared Links
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

        <nav className="space-y-3 text-sm flex-1">
          <div
            onClick={() => setActiveView("files")}
            className={`cursor-pointer ${
              activeView === "files"
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All My Files
          </div>

          <div
            onClick={() => setActiveView("shared")}
            className={`cursor-pointer ${
              activeView === "shared"
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Shared Links
          </div>
        </nav>

        <button
          onClick={logout}
          className="mt-6 border border-zinc-700 hover:border-zinc-500 rounded-md py-2 text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full p-4 sm:p-6 overflow-auto">
          {/* MY FILES VIEW */}
          {activeView === "files" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
              <div className="min-w-150">
                <div className="grid grid-cols-4 text-xs text-zinc-400 px-4 py-3 border-b border-zinc-800">
                  <span>Name</span>
                  <span>Type</span>
                  <span>Size</span>
                  <span className="text-right">Actions</span>
                </div>

                {loading ? (
                  <div className="px-4 py-6 text-sm text-zinc-400">
                    Loading files...
                  </div>
                ) : files.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-zinc-400">
                    No files uploaded yet.
                  </div>
                ) : (
                  files.map((file) => (
                    <div
                      key={file._id}
                      className="grid grid-cols-4 px-4 py-3 text-sm border-b border-zinc-800 items-center"
                    >
                      <span className="truncate">{file.originalName}</span>
                      <span className="text-zinc-400">{file.fileType}</span>
                      <span className="text-zinc-400">
                        {(file.fileSize / 1024).toFixed(1)} KB
                      </span>
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() =>
                            handleDownload(file._id, file.originalName)
                          }
                          className="text-indigo-400 hover:underline"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleShare(file._id)}
                          className="text-emerald-400 hover:underline"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SHARED LINKS VIEW */}
          {activeView === "shared" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
              <div className="min-w-150">
                <div className="grid grid-cols-4 text-xs text-zinc-400 px-4 py-3 border-b border-zinc-800">
                  <span>File</span>
                  <span>Expires</span>
                  <span>Status</span>
                  <span className="text-right">Action</span>
                </div>

                {sharedLinks.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-zinc-400">
                    No shared links created yet.
                  </div>
                ) : (
                  sharedLinks.map((link) => (
                    <div
                      key={link._id}
                      className="grid grid-cols-4 px-4 py-3 text-sm border-b border-zinc-800 items-center"
                    >
                      <span className="truncate">
                        {link.file?.originalName || "Unknown file"}
                      </span>
                      <span className="text-zinc-400">
                        {new Date(link.expiresAt).toLocaleString()}
                      </span>
                      <span
                        className={`text-xs ${
                          link.isActive
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {link.isActive ? "Active" : "Revoked"}
                      </span>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRevoke(link.token)}
                          disabled={!link.isActive}
                          className="text-red-400 hover:underline disabled:opacity-50"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Upload Button */}
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
              <input
                type="file"
                className="hidden"
                id="upload"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <label
                htmlFor="upload"
                className="cursor-pointer space-y-2 block"
              >
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
              <button
                onClick={uploadFiles}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-md"
              >
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
