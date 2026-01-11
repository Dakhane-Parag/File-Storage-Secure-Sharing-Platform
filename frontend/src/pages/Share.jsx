import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Share = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(true);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/share/public/${token}/meta`
        );

        if (!res.ok) throw new Error("invalid");

        const data = await res.json();
        setFileName(data.fileName);
      } catch {
        setError("This share link is invalid or expired.");
      }
    };

    fetchMeta();
  }, [token]);

  const downloadFile = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/share/public/${token}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        if (response.status === 404 || response.status === 410) {
          throw new Error("invalid_or_expired");
        }
        throw new Error("download_failed");
      }
      const disposition = response.headers.get("Content-Disposition");
      let filename = "New-Download";

      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      if (err.message === "invalid_or_expired") {
        setError("This share link is invalid or has expired.");
      } else {
        setError("Failed to download file. Please try again.");
      }
    } finally {
      setLoading(false);
      setReady(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center max-w-md w-full shadow-lg">
        <h1 className="text-xl font-semibold mb-1">Shared File</h1>

        <p className="text-sm text-zinc-400 mb-6">
          A file has been securely shared with you
        </p>

        {error ? (
          <div className="text-sm text-red-400 mb-6">{error}</div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-zinc-300 mb-4">
              📄 <span className="font-medium">{fileName}</span>
            </div>

            <button
              onClick={downloadFile}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 px-6 py-2 rounded-md text-sm w-full"
            >
              {loading ? "Downloading..." : "Download File"}
            </button>

            {ready && (
              <p className="text-xs text-zinc-500">
                Link expires automatically for security
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Share;
