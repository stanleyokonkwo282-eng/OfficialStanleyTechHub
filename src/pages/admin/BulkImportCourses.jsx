import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function BulkImportCourses() {
  const axiosSecure = useAxiosSecure();
  const [jsonInput, setJsonInput] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [importLog, setImportLog] = useState([]);

  const importMutation = useMutation({
    mutationFn: async (courses) => {
      const res = await axiosSecure.post("/courses/bulk-import", { courses });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Courses imported successfully");
      setImportLog((prev) => [...prev, { time: new Date().toLocaleTimeString(), message: data.message }]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Import failed");
      setImportLog((prev) => [...prev, { time: new Date().toLocaleTimeString(), message: "Error: " + (error?.response?.data?.message || error.message) }]);
    },
  });

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("Input must be a JSON array");
      importMutation.mutate(parsed);
    } catch (err) {
      toast.error("Invalid JSON: " + err.message);
    }
  };

  const handleCsvImport = () => {
    if (!csvFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split("\n").filter((line) => line.trim());
        if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row");
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const courses = lines.slice(1).map((line) => {
          const values = line.split(",");
          const course = {};
          headers.forEach((h, i) => {
            course[h] = values[i]?.trim() || "";
          });
          return course;
        });
        importMutation.mutate(courses);
      } catch (err) {
        toast.error("CSV parse error: " + err.message);
      }
    };
    reader.readAsText(csvFile);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">📦 Bulk Course Import</h1>
        <p className="text-gray-400 mb-6">Import multiple courses at once using JSON or CSV.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">JSON Import</h2>
            <p className="text-xs text-gray-400 mb-3">Paste a JSON array of course objects below.</p>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"title": "Course 1", "instructorEmail": "teacher@example.com", ...}]'
              className="w-full h-48 bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg p-3 font-mono focus:outline-none focus:border-yellow-400"
            />
            <button
              onClick={handleJsonImport}
              disabled={importMutation.isPending || !jsonInput.trim()}
              className="mt-3 w-full bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50"
            >
              {importMutation.isPending ? "Importing..." : "Import JSON"}
            </button>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">CSV Import</h2>
            <p className="text-xs text-gray-400 mb-3">Upload a CSV file with columns matching course fields.</p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="mb-3 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-500"
            />
            <button
              onClick={handleCsvImport}
              disabled={importMutation.isPending || !csvFile}
              className="w-full bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50"
            >
              {importMutation.isPending ? "Importing..." : "Import CSV"}
            </button>
          </div>
        </div>

        {importLog.length > 0 && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Import Log</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {importLog.map((log, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b border-zinc-800 pb-1">
                  <span className="text-gray-300">{log.message}</span>
                  <span className="text-gray-500 text-xs">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
